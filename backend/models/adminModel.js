import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: { type: String, default: null } // optional: store google id
});

export default mongoose.model("Admin", adminSchema);
