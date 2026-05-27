const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Khách hàng — chỉ món đang bán
  router.get("/", (req, res) => {
    db.query(
      "SELECT * FROM menu_items WHERE is_available = 1",
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
      },
    );
  });

  // Admin — toàn bộ món
  router.get("/admin", (req, res) => {
    db.query("SELECT * FROM menu_items", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Thêm món
  router.post("/admin", (req, res) => {
    const { name, category, price, image_url } = req.body;
    db.query(
      "INSERT INTO menu_items (name, category, price, image_url) VALUES (?, ?, ?, ?)",
      [name, category, price, image_url || null],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
      },
    );
  });

  // Cập nhật món
  router.put("/admin/:id", (req, res) => {
    const { id } = req.params;
    const { name, category, price, image_url, is_available } = req.body;
    db.query(
      "UPDATE menu_items SET name = ?, category = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?",
      [name, category, price, image_url, is_available, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      },
    );
  });

  // Xóa món
  router.delete("/admin/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM menu_items WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  return router;
};
