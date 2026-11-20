import { Job } from "../models/job.model.js";
import axios from 'axios';
import { analyzeResume } from "../utils/ai.js";
import { parsePdfInWorker } from "../utils/pdfParser.js";

// ✅ GET MATCH SCORE (AI Analysis)
export const getMatchScore = async (req, res) => {
    try {
        const { jobId, resumeUrl } = req.body;
        const job = await Job.findById(jobId);
        
        if (!job) return res.status(404).json({ message: "Job not found", success: false });
        if (!resumeUrl) return res.status(400).json({ message: "Resume URL missing", success: false });

        // SSRF Prevention: Validate that resumeUrl is from a trusted domain (Cloudinary)
        try {
            const parsedUrl = new URL(resumeUrl);
            if (parsedUrl.hostname !== 'res.cloudinary.com') {
                return res.status(400).json({
                    message: "Invalid resume URL. Only Cloudinary URLs are allowed.",
                    success: false
                });
            }
        } catch (err) {
            return res.status(400).json({
                message: "Invalid resume URL format.",
                success: false
            });
        }

        // 1. Download PDF from Cloudinary
        const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
        
        // 2. Parse Text using Worker Thread
        const resumeText = await parsePdfInWorker(response.data);

        // 3. AI Analysis Utility Call
        const analysis = await analyzeResume(resumeText, job.description);

        return res.status(200).json({ analysis, success: true });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ POST JOB (Smart Requirement Splitting for UI formatting)
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, positions, role, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !positions || !role || !companyId) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        }

        const reqArray = Array.isArray(requirements)
            ? requirements
            : requirements.split(/,|\n/).map(req => req.trim()).filter(Boolean);

        const job = await Job.create({
            title,
            description,
            requirements: reqArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            positions: Number(positions),
            role,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({ message: "New job created successfully.", job, success: true });
    } catch (error) {
        console.error("POST_JOB_ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// ✅ UPDATE JOB
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, experience, positions, role } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized: You did not create this job.", success: false });
        }

        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) {
            job.requirements = Array.isArray(requirements)
                ? requirements
                : requirements.split(/,|\n/).map(r => r.trim()).filter(Boolean);
        }
        if (salary !== undefined && salary !== "") job.salary = Number(salary);
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (experience !== undefined && experience !== "") job.experienceLevel = Number(experience);
        if (positions !== undefined && positions !== "") job.positions = Number(positions);
        if (role) job.role = role;

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("UPDATE_JOB_ERROR:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

// ✅ GET ALL JOBS
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });
        return res.status(200).json({ jobs: jobs || [], success: true });
    } catch (error) {
        console.error("GET_ALL_JOBS_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// ✅ GET JOB BY ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("applications");
        if (!job) return res.status(404).json({ message: "Job not found.", success: false });
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("GET_JOB_BY_ID_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// ✅ GET ADMIN JOBS
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate("company").sort({ createdAt: -1 });
        return res.status(200).json({ jobs: jobs || [], success: true });
    } catch (error) {
        console.error("GET_ADMIN_JOBS_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
