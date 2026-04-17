import { pool } from "../config/db.js";

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { name } = req.body;
  await pool.query("UPDATE users SET name = ? WHERE id = ?", [name, req.user.id]);
  const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id]);
  res.json(rows[0]);
};

export const getUsers = async (req, res) => {
  const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
  res.json(rows);
};

export const updateUserRole = async (req, res) => {
  await pool.query("UPDATE users SET role = ? WHERE id = ?", [req.body.role, req.params.id]);
  res.json({ message: "User role updated" });
};

export const deleteUser = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "User deleted" });
};
