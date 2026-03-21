import express from "express";
import { adminLogin, changeAdminPassword } from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.put("/password", protectAdmin, changeAdminPassword);

export default router;