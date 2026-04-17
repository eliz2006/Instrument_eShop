import app from "./app.js";
import { pool } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await pool.query("SELECT 1");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

start();
