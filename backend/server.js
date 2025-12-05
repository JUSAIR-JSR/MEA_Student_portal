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


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    const allowedOrigins = [
      "https://admin.middleeastacademy.in",
      "https://teacher.middleeastacademy.in",
      "https://student.middleeastacademy.in",
      "http://localhost:3000",
    ];
    const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
    const isAllowed = allowedOrigins.includes(origin) || vercelPattern.test(origin);
    if (isAllowed) {
      console.log("✅ ALLOWED ORIGIN:", origin);
      return callback(null, true);
    }
    console.log("❌ BLOCKED ORIGIN:", origin);
    return callback(new Error("CORS blocked"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // <-- respond to preflight for all routes




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
