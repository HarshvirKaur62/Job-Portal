import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
          
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoUrl = "";
        let resumeUrl = "";
        let resumeOriginalName = "";

        // 1. Handle Avatar (file) - Directly converting buffer to base64
        if (req.files && req.files.file && req.files.file.length > 0) {
            try {
                const avatarFile = req.files.file[0];
                const fileUri = `data:${avatarFile.mimetype};base64,${avatarFile.buffer.toString("base64")}`;
                const cloudResponse = await cloudinary.uploader.upload(fileUri);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadErr) {
                console.error("Avatar upload warning:", uploadErr.message);
            }
        }

        // 2. Handle Resume (Only for students) - Directly converting buffer to base64
        if (role === 'student') {
            if (!req.files || !req.files.resume || req.files.resume.length === 0) {
                return res.status(400).json({
                    message: "Students must upload a resume to join.",
                    success: false
                });
            }
            try {
                const resumeFile = req.files.resume[0];
                const resumeUri = `data:${resumeFile.mimetype};base64,${resumeFile.buffer.toString("base64")}`;
                const cloudResponse = await cloudinary.uploader.upload(resumeUri, { resource_type: "auto" });
                resumeUrl = cloudResponse.secure_url;
                resumeOriginalName = resumeFile.originalname;
            } catch (resumeErr) {
                console.error("Resume upload failed:", resumeErr.message);
                return res.status(500).json({
                    message: "Resume upload failed. Please try again.",
                    success: false
                });
            }
        }

        await User.create({
            fullname,
            email,
            phoneNumber: Number(phoneNumber) || phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
                resume: resumeUrl,
                resumeOriginalName: resumeOriginalName
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("REGISTRATION_ERROR:", error);
        return res.status(500).json({ message: error.message || "Internal server error", success: false });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        const isProduction = process.env.NODE_ENV === 'production';
        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction 
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            token,
            success: true
        })
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        return res.status(200).cookie("token", "", { 
            maxAge: 0, 
            httpOnly: true, 
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction 
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.error("LOGOUT_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file; 
        const userId = req.id; 
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

        if (!user.profile) {
            user.profile = {};
        }

        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = Number(phoneNumber) || user.phoneNumber;
        if(bio !== undefined) user.profile.bio = bio;
        if(skills) {
            user.profile.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
        }
      
        if(file){
            const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri, { resource_type: "auto" });
            
            if (file.mimetype === "application/pdf") {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
            } else {
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.error("UPDATE_PROFILE_ERROR:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
