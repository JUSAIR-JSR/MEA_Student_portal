// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Auto-detect role and login
export const login = async (req, res) => {
  try {
    const { email, rollNo, password } = req.body;
    let user = null;
    let role = null;

    // 1) Student login via rollNo
    if (rollNo) {
      user = await Student.findOne({ rollNo });
      if (user) role = "student";
    }

    // 2) Admin by email
    if (!user && email) {
      user = await Admin.findOne({ email });
      if (user) role = "admin";
    }

    // 3) Teacher by email
    if (!user && email) {
      user = await Teacher.findOne({ email });
      if (user) role = "teacher";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set HttpOnly cookie
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in prod
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: `${role} logged in`,
        role,
      });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// return user & role (protected)
export const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    let user = null;
    if (role === "admin") user = await Admin.findById(id).select("-password");
    if (role === "teacher") user = await Teacher.findById(id).select("-password");
    if (role === "student") user = await Student.findById(id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ role, user });
  } catch (err) {
    console.error("getMe error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// logout - clear cookie
export const logout = (req, res) => {
  res.clearCookie("authToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
};

// Google admin auth (keeps your existing logic, but set cookie)
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    const allowedAdmins = process.env.ADMIN_GOOGLE_EMAILS
      ? process.env.ADMIN_GOOGLE_EMAILS.split(",").map((s) => s.trim())
      : [];

    if (!allowedAdmins.includes(email))
      return res.status(403).json({ message: "Not authorized as admin" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Admin not registered" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Admin logged in (google)", role: "admin", email });
  } catch (err) {
    console.error("Google auth error", err);
    res.status(500).json({ message: "Google auth failed" });
  }
};
