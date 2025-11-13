// backend/controllers/adminStatsController.js
import Result from "../models/resultModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import Exam from "../models/examModel.js";
import mongoose from "mongoose";

const PASS_MARK = Number(process.env.PASS_MARK) || 35;

// Overview counts
export const getOverview = async (req, res) => {
  try {
    const [studentsCount, teachersCount, examsCount, resultsCount] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Exam.countDocuments(),
      Result.countDocuments(),
    ]);

    res.json({
      students: studentsCount,
      teachers: teachersCount,
      exams: examsCount,
      results: resultsCount,
    });
  } catch (err) {
    console.error("Error getOverview:", err);
    res.status(500).json({ message: err.message });
  }
};

// Pass / Fail counts
export const getPassFail = async (req, res) => {
  try {
    // aggregate pass/fail by comparing marks >= PASS_MARK
    const agg = await Result.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          passed: { $sum: { $cond: [{ $gte: ["$marks", PASS_MARK] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $lt: ["$marks", PASS_MARK] }, 1, 0] } },
        },
      },
    ]);

    const stats = agg[0] || { total: 0, passed: 0, failed: 0 };

    res.json({
      total: stats.total,
      passed: stats.passed,
      failed: stats.failed,
      passPercent: stats.total ? ((stats.passed / stats.total) * 100).toFixed(2) : "0.00",
      failPercent: stats.total ? ((stats.failed / stats.total) * 100).toFixed(2) : "0.00",
      passMark: PASS_MARK,
    });
  } catch (err) {
    console.error("Error getPassFail:", err);
    res.status(500).json({ message: err.message });
  }
};

// Subject-wise average
export const getSubjectAverages = async (req, res) => {
  try {
    const agg = await Result.aggregate([
      {
        $group: {
          _id: "$subject",
          avgMarks: { $avg: "$marks" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          subject: "$_id",
          avgMarks: { $round: ["$avgMarks", 2] },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { avgMarks: -1 } },
    ]);

    res.json(agg);
  } catch (err) {
    console.error("Error getSubjectAverages:", err);
    res.status(500).json({ message: err.message });
  }
};
