import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTableAuth } from "../hooks/useTableAuth";
import { useCart } from "../hooks/useCart";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";
import BillPanel from "../components/BillPanel";

function TablePage() {
  const { tableNumber } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { valid, menu } = useTableAuth(tableNumber, token);
  const { cart, addToCart, removeFromCart, total } = useCart();
  const [orderCount, setOrderCount] = useState(0);

  const placeOrder = () => {
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");
    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_number: tableNumber, items: cart }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`Đặt đơn thành công cho bàn ${tableNumber}!`);
        cart.forEach((item) => removeFromCart(item.id));
        setOrderCount((prev) => prev + 1); // ← tăng lên 1 để trigger BillPanel fetch lại
      });
  };

  if (valid === null)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Đang kiểm tra...
      </div>
    );

  if (valid === false)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-5xl">🚫</p>
        <p className="text-xl font-semibold text-red-500">Mã QR không hợp lệ</p>
        <p className="text-gray-400 text-sm">
          Vui lòng quét lại mã QR trên bàn
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-amber-700 font-semibold text-lg">
          🪑 Bàn số {tableNumber}
        </p>
      </div>
      <h1 className="text-2xl font-bold mb-4">☕ Menu</h1>
      <MenuGrid menu={menu} onAdd={addToCart} />
      <CartPanel
        cart={cart}
        total={total}
        onRemove={removeFromCart}
        onOrder={placeOrder}
        tableNumber={tableNumber}
      />
      <BillPanel tableNumber={tableNumber} fetchTrigger={orderCount} />
    </div>
  );
}

export default TablePage;
