import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("REGISTER_COMPANY_ERROR:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get all companies for the logged-in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; 
        const companies = await Company.find({ userId });
        return res.status(200).json({
            companies: companies || [],
            success: true
        });
    } catch (error) {
        console.error("GET_COMPANY_ERROR:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get a specific company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("GET_COMPANY_BY_ID_ERROR:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Update company details
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        // Find the company first to verify ownership
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // IDOR Prevention: Check if the logged-in user is the owner of the company
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "Unauthorized access: You do not own this company.",
                success: false
            });
        }

        // Apply text fields
        if (name) company.name = name;
        if (description) company.description = description;
        if (website) company.website = website;
        if (location) company.location = location;

        // Handle Cloudinary upload only if a file is attached
        if (file) {
            const fileUri = getDataUri(file);
            if (fileUri && fileUri.content) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                company.logo = cloudResponse.secure_url;
            }
        }

        await company.save();

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            message: "An error occurred while updating company details.",
            success: false
        });
    }
};
