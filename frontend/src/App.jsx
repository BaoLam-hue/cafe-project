import { useEffect, useState } from "react";

function App() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>☕ Menu Quán Cà Phê</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {menu.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
            }}
          >
            <h3>{item.name}</h3>
            <p style={{ color: "#c0392b", fontWeight: "bold" }}>
              {Number(item.price).toLocaleString("vi-VN")}đ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
