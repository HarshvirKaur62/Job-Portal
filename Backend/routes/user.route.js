import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Multi-file controller handling keys 'file' and 'resume'
const multiUpload = upload.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'resume', maxCount: 1 }
]);

router.route("/register").post(multiUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, upload.single('file'), updateProfile);

export default router;