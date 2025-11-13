import Exam from "../models/examModel.js";
import Result from "../models/resultModel.js";
import Student from "../models/studentModel.js";
import mongoose from "mongoose";

// ➕ Create exam
export const createExam = async (req, res) => {
  try {
    const { title,subject, description, date } = req.body;
    const exam = new Exam({
      title,
      description,
      date,
      subject,
      createdBy: req.user.id,
    });
    await exam.save();
    res.json({ message: "Exam created successfully", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Assign teachers and students to exam
export const assignExam = async (req, res) => {
  try {
    const { teacherIds, studentIds } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    exam.teacherIds = teacherIds.map((id) => new mongoose.Types.ObjectId(id));
    exam.studentIds = studentIds.map((id) => new mongoose.Types.ObjectId(id));

    await exam.save();
    res.json({ message: "Exam updated with teachers and students", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Remove one teacher or student from exam
export const removeAssignment = async (req, res) => {
  try {
    const { examId, userId, role } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    if (role === "teacher") {
      exam.teacherIds = exam.teacherIds.filter((id) => id.toString() !== userId);
    } else if (role === "student") {
      exam.studentIds = exam.studentIds.filter((id) => id.toString() !== userId);
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await exam.save();
    res.json({ message: "Assignment removed successfully", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📋 Get all exams
export const getExams = async (req, res) => {
  try {
    const { role, id } = req.user;
    let exams;

    if (role === "admin") {
      exams = await Exam.find().populate("teacherIds", "name email").populate("studentIds", "name rollNo department");
    } else if (role === "teacher") {
      exams = await Exam.find({ teacherIds: id }).populate("studentIds", "name rollNo department");
    } else if (role === "student") {
      exams = await Exam.find({ studentIds: id, isPublished: true }).populate("teacherIds", "name email");
    }

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Toggle publish status
export const togglePublish = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    exam.isPublished = !exam.isPublished;
    await exam.save();

    res.json({ message: `Exam ${exam.isPublished ? "published" : "unpublished"} successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Exam (Admin)
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, description, date } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { title, subject, description, date },
      { new: true }
    );

    if (!updatedExam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete Exam (Admin)
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(id);
    if (!deletedExam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   🧑‍🏫  TEACHER DASHBOARD CONTROLLERS
   ============================= */

// ✅ Get all exams assigned to this teacher
export const getAssignedExams = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);

    const exams = await Exam.find({ teacherIds: teacherId })
      .populate("teacherIds", "name subject")
      .populate("studentIds", "name rollNo department")
      .sort({ date: -1 });

    res.json(exams);
  } catch (error) {
    console.error("Error fetching assigned exams:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get students of a specific exam (with result info)
export const getExamStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = new mongoose.Types.ObjectId(req.user.id);

    const exam = await Exam.findOne({
      _id: id,
      teacherIds: teacherId,
    }).populate("studentIds", "name rollNo department");

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Fetch existing results for this exam
    const results = await Result.find({ examId: id }).lean();

    // Map student data with their result
    const studentsWithResults = exam.studentIds.map((s) => {
      const result = results.find(
        (r) => r.studentId.toString() === s._id.toString()
      );
      return {
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo,
        department: s.department,
        marks: result?.marks || "",
        grade: result?.grade || "",
        resultId: result?._id || null,
      };
    });

    res.json({
      examTitle: exam.title,
      students: studentsWithResults,
    });
  } catch (error) {
    console.error("Error fetching exam students:", error);
    res.status(500).json({ message: error.message });
  }
};