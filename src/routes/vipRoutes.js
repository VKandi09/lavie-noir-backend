import express from "express";
import { createVIP } from "../controllers/vipController.js";

const router = express.Router();

router.post("/", createVIP);

export default router;
