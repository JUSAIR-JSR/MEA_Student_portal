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

//let start new features  

export const getDepartmentPerformance = async (req, res) => {
  try {
    const result = await Result.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $group: {
          _id: "$student.department",
          averageMarks: { $avg: "$marks" },
          students: { $addToSet: "$studentId" },
        },
      },
      {
        $project: {
          department: "$_id",
          averageMarks: { $round: ["$averageMarks", 2] },
          students: { $size: "$students" },
          _id: 0,
        },
      },
      { $sort: { averageMarks: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error getDepartmentPerformance:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getTopPerformers = async (req, res) => {
  try {
    const result = await Result.aggregate([
      {
        $group: {
          _id: "$studentId",
          averageMarks: { $avg: "$marks" },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $project: {
          _id: 1,
          name: "$student.name",
          rollNo: "$student.rollNo",
          department: "$student.department",
          averageMarks: { $round: ["$averageMarks", 2] }
        }
      },
      { $sort: { averageMarks: -1 } },
      { $limit: 10 }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error getTopPerformers:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const result = await Result.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          averageMarks: { $avg: "$marks" },
          exams: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          averageMarks: { $round: ["$averageMarks", 2] },
          exams: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const formatted = result.map(r => ({
      month: monthNames[r.month - 1],
      averageMarks: r.averageMarks,
      exams: r.exams
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error getMonthlyTrends:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 }).limit(5);
    const results = await Result.find().sort({ createdAt: -1 }).limit(5);

    const formatted = [
      ...exams.map(e => ({
        type: "Exam",
        description: `New exam created: ${e.title}`,
        timestamp: e.createdAt
      })),
      ...results.map(r => ({
        type: "Result",
        description: `Result published for ${r.subject}`,
        timestamp: r.createdAt
      }))
    ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

    res.json(formatted);
  } catch (err) {
    console.error("Error getRecentActivity:", err);
    res.status(500).json({ message: err.message });
  }
};
