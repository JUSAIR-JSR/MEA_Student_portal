import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  // Only for email-password admins
  password: { type: String, default: null },

  // Only for Google login admins
  googleId: { type: String, default: null },

  authType: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  role: {
    type: String,
    enum: ["admin"],
    default: "admin"
  }
});

export default mongoose.model("Admin", adminSchema);
