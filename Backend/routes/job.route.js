import express from "express";
import isAuthenticated, { isRecruiter } from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, getMatchScore } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isRecruiter, postJob);
router.get("/get", getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated, isRecruiter, updateJob);
router.route("/adminjobs").get(isAuthenticated, isRecruiter, getAdminJobs);
router.route("/analyze").post(isAuthenticated, getMatchScore);

export default router;
