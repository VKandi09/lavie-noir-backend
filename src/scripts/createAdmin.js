import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("Admin@123", 10);

await Admin.create({
  email: "admin@lavienightclub.com",
  password: hashedPassword
});

console.log("✅ Admin created");
process.exit();
