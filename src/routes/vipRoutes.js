import express from "express";
import {
  createVIP,
  getVIPStats,
  getAllVIPs,
  updateVIPStatus,
  updateVIP,
  deleteVIP,
} from "../controllers/vipController.js";
import { protectAdmin } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/", createVIP);
router.get("/stats", protectAdmin, getVIPStats);
router.get("/all", protectAdmin, getAllVIPs);
router.get("/", protectAdmin, getVIPStats);
router.put("/:id/status", protectAdmin, updateVIPStatus);
router.put("/:id", protectAdmin, updateVIP);
router.delete("/:id", protectAdmin, deleteVIP);

export default router;
