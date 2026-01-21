import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () =>
  console.log(`Server running on port ${PORT}`)
);
