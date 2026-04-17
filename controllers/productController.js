import { pool } from "../config/db.js";

export const getProducts = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC`
  );
  res.json(rows);
};

export const getProductById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Product not found" });
  res.json(rows[0]);
};

export const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, stock, image_url, category_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock, image_url, category_id]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
};

export const updateProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  await pool.query(
    `UPDATE products
     SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?
     WHERE id = ?`,
    [name, description, price, stock, image_url, category_id, req.params.id]
  );
  res.json({ message: "Product updated" });
};

export const deleteProduct = async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};
