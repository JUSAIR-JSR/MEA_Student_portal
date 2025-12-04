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
  "https://admin.middleeastacademy.in", // your Vite admin
];

const vercelOrigins = /^https:\/\/.*vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || vercelOrigins.test(origin)) {
        console.log("✅ ALLOWED:", origin);
        return callback(null, true);
      }

      console.log("❌ BLOCKED:", origin);
      return callback(new Error("CORS blocked"), false);
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
