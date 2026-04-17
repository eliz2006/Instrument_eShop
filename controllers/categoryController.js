import { pool } from "../config/db.js";

export const getCategories = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  res.json(rows);
};

export const getCategoryById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Category not found" });
  res.json(rows[0]);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required" });
  const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
  res.status(201).json({ id: result.insertId, name });
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name, req.params.id]);
  res.json({ message: "Category updated" });
};

export const deleteCategory = async (req, res) => {
  await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  res.json({ message: "Category deleted" });
};
