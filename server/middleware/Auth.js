import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "happy-zimba-admin-jwt-secret-2026";

export const isAuthenticated = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};