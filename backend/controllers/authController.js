// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// LOGIN (auto detects admin / teacher / student)
export const login = async (req, res) => {
  
    console.log("LOGIN request body:", req.body, "Origin:", req.headers.origin);

  try {
    const { email, rollNo, password } = req.body;
    let user = null;
    let role = null;

    // Student login using rollNo
    if (rollNo) {
      user = await Student.findOne({ rollNo });
      if (user) role = "student";
    }

    // Admin login using email
    if (!user && email) {
      user = await Admin.findOne({ email });
      if (user) role = "admin";
    }

    // Teacher login using email
    if (!user && email) {
      user = await Teacher.findOne({ email });
      if (user) role = "teacher";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ BLOCK password login for Google Admin accounts
    if (role === "admin" && user.authType === "google") {
      return res.status(400).json({
        message: "Google Admins must log in using Google Sign-In",
      });
    }

    // Only LOCAL admins/teachers/students reach this point
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("authToken", token, {
        httpOnly: true,

        //for local use
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "lax",

        //for deployment in render
        secure: true,
        sameSite: "none",
        domain: ".middleeastacademy.in", // ← IMPORTANT: allow cookie across subdomains
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
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


// WHO AM I (protected route)
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


// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("authToken", {
    path: "/",
    httpOnly: true,
    //its for local developement
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "lax",
    
    //its for deploy  in render
    secure: true,
    sameSite: "none",
    domain: ".middleeastacademy.in",
  });

  res.json({ message: "Logged out" });
};



// GOOGLE ADMIN AUTH
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Allowed Admin Emails from .env
    const allowedAdmins = process.env.ADMIN_GOOGLE_EMAILS
      ? process.env.ADMIN_GOOGLE_EMAILS.split(",").map((e) => e.trim())
      : [];

    // Email must be in admin list
    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    // Admin must exist in DB
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found in database" });
    }

    // Now generate token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("authToken", token, {
        httpOnly: true,
        //its for local test
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "lax",
        //
        //its for production ready site in render
        secure: true,
        sameSite: "none",
        domain: ".middleeastacademy.in",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Admin logged in (Google)",
        role: "admin",
        email,
      });

  } catch (err) {
    console.error("Google auth error", err);
    res.status(500).json({ message: "Google auth failed" });
  }
};
