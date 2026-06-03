const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const { table_number, items } = req.body;
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Kiểm tra bàn đã có order pending chưa
    db.query(
      "SELECT id FROM orders WHERE table_number = ? AND status = 'pending'",
      [table_number],
      (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existing.length > 0) {
          // Đã có order → thêm vào order cũ
          const orderId = existing[0].id;

          const promises = items.map(
            (item) =>
              new Promise((resolve, reject) => {
                // Kiểm tra món này đã có trong order chưa
                db.query(
                  "SELECT id, quantity FROM order_items WHERE order_id = ? AND menu_item_id = ?",
                  [orderId, item.id],
                  (err, existingItem) => {
                    if (err) return reject(err);

                    if (existingItem.length > 0) {
                      // Món đã có → tăng số lượng
                      db.query(
                        "UPDATE order_items SET quantity = quantity + ? WHERE id = ?",
                        [item.quantity, existingItem[0].id],
                        (err) => {
                          if (err) return reject(err);
                          resolve();
                        },
                      );
                    } else {
                      // Món chưa có → thêm mới
                      db.query(
                        "INSERT INTO order_items (order_id, menu_item_id, quantity, note) VALUES (?, ?, ?, ?)",
                        [orderId, item.id, item.quantity, item.note || ""],
                        (err) => {
                          if (err) return reject(err);
                          resolve();
                        },
                      );
                    }
                  },
                );
              }),
          );

          // Cập nhật tổng tiền
          Promise.all(promises)
            .then(() => {
              db.query(
                "UPDATE orders SET total = total + ? WHERE id = ?",
                [total, orderId],
                (err) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({ success: true, order_id: orderId });
                },
              );
            })
            .catch((err) => res.status(500).json({ error: err.message }));
        } else {
          // Chưa có order → tạo mới như cũ
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
        }
      },
    );
  });

  // Lấy đơn hàng chưa trả của bàn
  router.get("/table/:tableNumber", (req, res) => {
    db.query(
      `SELECT oi.id as order_item_id, oi.quantity, oi.note,
            mi.name, mi.price, mi.image_url,
            o.id as order_id, o.created_at
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE o.table_number = ? AND o.status != 'done'
     ORDER BY o.created_at ASC`,
      [req.params.tableNumber],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
      },
    );
  });

  // Thanh toán một phần hoặc toàn bộ món
  router.post("/checkout", (req, res) => {
    const { items } = req.body;
    // items = [{ order_item_id: 1, quantity: 2 }, ...]

    if (!items?.length)
      return res.status(400).json({ error: "Không có món nào" });

    const promises = items.map(({ order_item_id, quantity }) => {
      return new Promise((resolve, reject) => {
        // Lấy số lượng hiện tại
        db.query(
          "SELECT quantity FROM order_items WHERE id = ?",
          [order_item_id],
          (err, results) => {
            if (err) return reject(err);
            if (!results.length) return resolve();

            const currentQty = results[0].quantity;
            const remaining = currentQty - quantity;

            if (remaining <= 0) {
              // Trả hết → xóa dòng
              db.query(
                "DELETE FROM order_items WHERE id = ?",
                [order_item_id],
                (err) => {
                  if (err) return reject(err);
                  resolve();
                },
              );
            } else {
              // Trả một phần → giảm số lượng
              db.query(
                "UPDATE order_items SET quantity = ? WHERE id = ?",
                [remaining, order_item_id],
                (err) => {
                  if (err) return reject(err);
                  resolve();
                },
              );
            }
          },
        );
      });
    });

    Promise.all(promises)
      .then(() => res.json({ success: true }))
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
