import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  rollNo: { type: String, unique: true },
  department: String,
});

export default mongoose.model("Student", studentSchema);
