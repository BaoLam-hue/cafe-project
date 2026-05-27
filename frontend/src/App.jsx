import { useEffect, useState } from "react";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");
    const tableNumber = prompt("Nhập số bàn của bạn:");
    if (!tableNumber) return;

    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_number: tableNumber, items: cart }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Đặt đơn thành công!");
        setCart([]);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">☕ Menu Quán Cà Phê</h1>

      {/* Danh sách món */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
          >
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.category}</p>
            <p className="text-red-600 font-bold">
              {Number(item.price).toLocaleString("vi-VN")}đ
            </p>
            <button
              onClick={() => addToCart(item)}
              className="mt-auto bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 text-sm transition-colors"
            >
              + Thêm
            </button>
          </div>
        ))}
      </div>

      {/* Giỏ hàng */}
      <div className="mt-8 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">🛒 Giỏ hàng</h2>
        {cart.length === 0 ? (
          <p className="text-gray-300">Chưa có món nào</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">
                    {item.name}{" "}
                    <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {Number(item.price * item.quantity).toLocaleString("vi-VN")}
                    đ
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm rounded px-2 py-0.5 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-red-600">
                {Number(total).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <button
              onClick={placeOrder}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-base font-medium transition-colors"
            >
              Đặt đơn
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
