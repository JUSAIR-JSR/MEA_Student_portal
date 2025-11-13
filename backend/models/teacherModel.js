import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  subject: String,
});

export default mongoose.model("Teacher", teacherSchema);
