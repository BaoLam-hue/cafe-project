const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:tableNumber", (req, res) => {
    const { tableNumber } = req.params;
    const { token } = req.query;
    if (!token) return res.status(401).json({ error: "Không có token" });

    db.query(
      "SELECT * FROM tables WHERE table_number = ? AND token = ?",
      [tableNumber, token],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(403).json({ error: "Token không hợp lệ" });
        res.json({ valid: true, table_number: tableNumber });
      },
    );
  });

  return router;
};
