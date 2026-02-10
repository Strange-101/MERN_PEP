import express from "express";
import {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateStatus,
    deleteComplaint
} from "../controllers/complaint.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);
router.post("/", createComplaint);
router.put("/:id", auth, updateStatus);
router.delete("/:id", auth, deleteComplaint);

export default router;
