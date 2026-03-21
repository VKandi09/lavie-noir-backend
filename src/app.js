import express from "express";
import cors from "cors";
import vipRoutes from "./routes/vipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lavie-noir.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use((req, _res, next) => {
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

app.use("/api/reservations", reservationRoutes);

export default app;