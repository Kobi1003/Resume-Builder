import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeroutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Server is running")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
