import { pool } from "../config/db.js";

export const createOrder = async (req, res) => {
  const { items, shipping_address } = req.body;
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    for (const item of items) {
      const [pRows] = await conn.query("SELECT price, stock FROM products WHERE id = ?", [item.product_id]);
      if (!pRows.length || pRows[0].stock < item.quantity) {
        throw new Error("Insufficient stock for one or more items");
      }
      total += Number(pRows[0].price) * Number(item.quantity);
    }

    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'pending')",
      [req.user.id, total, shipping_address || ""]
    );

    for (const item of items) {
      const [pRows] = await conn.query("SELECT price FROM products WHERE id = ?", [item.product_id]);
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderResult.insertId, item.product_id, item.quantity, pRows[0].price]
      );
      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.product_id,
      ]);
    }

    await conn.commit();
    res.status(201).json({ message: "Order placed", order_id: orderResult.insertId });
  } catch (error) {
    await conn.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    conn.release();
  }
};

export const getMyOrders = async (req, res) => {
  const [orders] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(orders);
};

export const getMyOrderById = async (req, res) => {
  const [orders] = await pool.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.user.id,
  ]);
  if (!orders.length) return res.status(404).json({ message: "Order not found" });

  const [items] = await pool.query(
    `SELECT oi.*, p.name AS product_name, p.image_url
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [req.params.id]
  );

  res.json({ ...orders[0], items });
};

export const getAllOrders = async (req, res) => {
  const [orders] = await pool.query(
    `SELECT o.*, u.name AS user_name, u.email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ message: "Order status updated" });
};

export const deleteOrder = async (req, res) => {
  const [orders] = await pool.query("SELECT id, status FROM orders WHERE id = ?", [req.params.id]);
  if (!orders.length) return res.status(404).json({ message: "Order not found" });

  if (!["pending", "cancelled"].includes(orders[0].status)) {
    return res.status(400).json({ message: "Only pending/cancelled orders can be deleted" });
  }

  await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
  res.json({ message: "Order deleted" });
};
