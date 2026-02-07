import express from "express";
import cors from "cors";
import vipRoutes from "./routes/vipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

/* TEMP DEBUG MODE — ALLOW EVERYTHING */
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("API running...");
});

/* ROUTES */
app.use("/api/vip", vipRoutes);

app.use("/api/admin", adminRoutes);

export default app;