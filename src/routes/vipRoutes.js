import express from "express";
import { createVIP, getVIPStats, updateVIPStatus } from "../controllers/vipController.js";
import { protectAdmin } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/", createVIP);
router.get("/", protectAdmin, getVIPStats);
router.put("/:id/status", protectAdmin, updateVIPStatus);
router.get("/stats", protectAdmin, getVIPStats);

export default router;
