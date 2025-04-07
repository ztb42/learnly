// import dotenv from "dotenv";
// dotenv.config();
import("dotenv").then((dotenv) => dotenv.config());

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import trainingProgramRoutes from "./routes/trainingProgramRoutes.js";
import trainingSessionRoutes from "./routes/trainingSessionRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import completionStatusRoutes from "./routes/completionStatusRoutes.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["https://learnlywsu.netlify.app", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/training-programs", trainingProgramRoutes);
app.use("/api/training-sessions", trainingSessionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/completion-statuses", completionStatusRoutes);

export default app;
