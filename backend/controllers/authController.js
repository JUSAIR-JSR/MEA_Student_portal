import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import { OAuth2Client } from "google-auth-library";


// 🔐 LOGIN (common endpoint)
export const login = async (req, res) => {
  try {
    const { email, rollNo, password, role } = req.body;
    let user;

    if (role === "admin") user = await Admin.findOne({ email });
    if (role === "teacher") user = await Teacher.findOne({ email });
    if (role === "student") user = await Student.findOne({ rollNo });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🧑‍💼 Register Admin (only via Postman)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hash = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hash });
    await admin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//google auth for admin
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// existing login/registerAdmin here (keep as you have)

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; // Google token from frontend

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // 🔐 Multi-admin authorization
    const allowedAdmins = process.env.ADMIN_GOOGLE_EMAILS.split(",").map((e) =>
      e.trim()
    );

    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({
        message: "You are not authorized as admin",
      });
    }

    // 🔍 Find admin in DB
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not registered",
      });
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "admin",
      email,
      message: "Admin login successful",
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
