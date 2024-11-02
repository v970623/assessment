import { Router } from "express";
import {
  submitApplication,
  updateApplicationStatus,
  getApplications,
  searchApplications,
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

router.get("/search", authenticate, (req, res) => {
  searchApplications(req, res);
});

export default router;
