const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Kết nối database thất bại:", err);
    return;
  }
  console.log("Kết nối database thành công!");
});

app.use("/api/menu", require("./routes/menu")(db));
app.use("/api/orders", require("./routes/orders")(db));
app.use("/api/table", require("./routes/tables")(db));
app.use("/api/categories", require("./routes/categories")(db));

module.exports = app;
