const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const { table_number, items } = req.body;
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    db.query(
      "INSERT INTO orders (table_number, total) VALUES (?, ?)",
      [table_number, total],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const orderId = result.insertId;
        const orderItems = items.map((item) => [
          orderId,
          item.id,
          item.quantity,
          item.note || "",
        ]);

        db.query(
          "INSERT INTO order_items (order_id, menu_item_id, quantity, note) VALUES ?",
          [orderItems],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, order_id: orderId });
          },
        );
      },
    );
  });

  return router;
};
