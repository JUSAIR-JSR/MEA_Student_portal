import Result from "../models/resultModel.js";
import Exam from "../models/examModel.js";
import mongoose from "mongoose";

// ✅ Add or Update Result
export const saveResult = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { examId } = req.params;
    const { studentId, marks, grade } = req.body;
    const finalGrade = grade && grade.trim() !== "" ? grade : "N/A"; // 👈 default


    // Safety checks
    if (!examId || !studentId)
      return res.status(400).json({ message: "Missing examId or studentId" });

    // Ensure this teacher is assigned to that exam
    const exam = await Exam.findOne({
      _id: examId,
      teacherIds: new mongoose.Types.ObjectId(teacherId),
    });

    if (!exam)
      return res.status(403).json({ message: "Unauthorized to modify this exam" });

    // Always use exam title as subject
    const subject = exam.title || "General";

    // Create or update result
    let result = await Result.findOne({ examId, studentId });

    if (result) {
      // ✏️ Update existing
      result.marks = marks;
      result.grade = grade;
      result.subject = subject;
      await result.save();
      return res.json({ message: "Result updated successfully", result });
    }

    // ➕ Create new result
    result = new Result({
      examId,
      studentId,
      teacherId,
      subject,
      marks,
      grade: finalGrade, // 👈 use this instead of grade
      
    });

    await result.save();
    res.json({ message: "Result added successfully", result });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ Delete a result
export const deleteResult = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params; // result ID

    const result = await Result.findById(id);
    if (!result)
      return res.status(404).json({ message: "Result not found" });

    // Check if this teacher owns this result
    if (result.teacherId.toString() !== teacherId)
      return res.status(403).json({ message: "Unauthorized" });

    await result.deleteOne();
    res.json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
