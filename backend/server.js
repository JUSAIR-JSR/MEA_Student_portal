// server.js (or app.js)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",

  // Hosted frontend apps
  // "https://admin.middleeastacademy.in",
  // "https://teacher.middleeastacademy.in",
  // "https://student.middleeastacademy.in",

];


app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.get("/", (req, res) => {
  res.send("Backend API running successfully ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
