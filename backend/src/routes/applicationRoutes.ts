import { Router } from "express";
import {
  submitApplication,
  updateApplicationStatus,
} from "../controllers/applicationController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/submit", authenticate, (req, res) => {
  submitApplication(req, res);
});

router.put("/update", authenticate, (req, res) => {
  updateApplicationStatus(req, res);
});

export default router;
