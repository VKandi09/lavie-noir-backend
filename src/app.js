import express from "express";
import cors from "cors";
import vipRoutes from "./routes/vipRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
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


export default app;
