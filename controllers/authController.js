import bcrypt from "bcryptjs";
import passport from "passport";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/token.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
    [name, email, hashedPassword]
  );

  const token = generateToken({ id: result.insertId });
  res.status(201).json({
    token,
    user: { id: result.insertId, name, email, role: "user" },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password || "");
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({ id: user.id });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const googleCallbackSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }

  const token = generateToken({ id: req.user.id });
  return res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};

export const googleAuthSuccess = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No authenticated Google user found" });

  const token = generateToken({ id: req.user.id });
  return res.json({
    message: "Google authentication successful",
    token,
    user: req.user,
  });
};

export const googleAuthFail = (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
};
