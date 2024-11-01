import { Router } from "express";
import {
  submitApplication,
  updateApplicationStatus,
  getApplications,
} from "../controllers/applicationController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/submit", authenticate, (req, res) => {
  submitApplication(req, res);
});

router.put("/update", authenticate, (req, res) => {
  updateApplicationStatus(req, res);
});

router.get("/list", authenticate, (req, res) => {
  getApplications(req, res);
});

export default router;
