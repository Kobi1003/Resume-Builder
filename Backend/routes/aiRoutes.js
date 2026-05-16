import express from "express";
import protect from "../middlewares/authmiddleware.js";
import { enhanceJobDescription, enhanceResume, uploadResume } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceResume)
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription)
aiRouter.post("/upload-resume", protect, uploadResume)

export default aiRouter 