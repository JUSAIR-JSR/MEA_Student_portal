import Student from "../models/studentModel.js";
import Exam from "../models/examModel.js";
import Result from "../models/resultModel.js";
import mongoose from "mongoose";

// 📘 Get all published exams assigned to this student
export const getAssignedExams = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    const exams = await Exam.find({
      studentIds: studentId,
      isPublished: true,
    })
      .populate("teacherIds", "name subject")
      .sort({ date: -1 });

    res.json(exams);
  } catch (error) {
    console.error("❌ Error fetching assigned exams:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🧾 Get all results for this student
// ✅ Get only published results for the logged-in student
export const getMyResults = async (req, res) => {
  try {
    const studentId = req.user.id;

    const results = await Result.find({ studentId })
      .populate("studentId", "name rollNo department email") // ✅ ADD THIS
      .populate({
        path: "examId",
        select: "title date isPublished subject",
        match: { isPublished: true }
      })
      .populate("teacherId", "name subject")
      .sort({ createdAt: -1 });

    // Remove results of unpublished exams
      const publishedResults = results.filter(
        r => r.examId !== null && r.studentId !== null);
    res.json(publishedResults);

  } catch (err) {
    console.error("❌ Error fetching student results:", err);
    res.status(500).json({ message: err.message });
  }
};



// 👤 Get logged-in student profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select(
      "name email rollNo department"
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🧩 Get new or upcoming exams (for notifications)
export const getExamNotifications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const now = new Date();

    const exams = await Exam.find({
      studentIds: studentId,
      isPublished: true,
      date: { $gte: now }, // future or today
    })
      .populate("teacherIds", "name subject")
      .sort({ date: 1 }); // soonest first

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
