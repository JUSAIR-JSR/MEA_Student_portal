// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("protect error", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
