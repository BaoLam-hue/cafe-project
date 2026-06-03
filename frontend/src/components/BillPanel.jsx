import { useEffect, useState } from "react";
import { useTableOrders } from "../hooks/useTableOrders";

function BillPanel({ tableNumber, fetchTrigger }) {
  const { orders, fetchOrders, checkout } = useTableOrders(tableNumber);
  const [checked, setChecked] = useState({});
  const [payQty, setPayQty] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, fetchTrigger]);

  // Tính payQty trực tiếp từ orders — không dùng useEffect
  const getPayQty = (id) =>
    payQty[id] ?? orders.find((o) => o.order_item_id === id)?.quantity ?? 1;

  const toggleItem = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const allChecked = orders.every((o) => checked[o.order_item_id]);
    const newChecked = {};
    orders.forEach((o) => {
      newChecked[o.order_item_id] = !allChecked;
    });
    setChecked(newChecked);
  };

  const checkedItems = orders.filter((o) => checked[o.order_item_id]);

  const checkedTotal = checkedItems.reduce((sum, o) => {
    return sum + o.price * getPayQty(o.order_item_id);
  }, 0);

  const checkedQtyTotal = checkedItems.reduce(
    (sum, o) => sum + getPayQty(o.order_item_id),
    0,
  );

  const handleCheckout = () => {
    if (!checkedItems.length) return alert("Chưa chọn món nào!");
    const items = checkedItems.map((o) => ({
      order_item_id: o.order_item_id,
      quantity: getPayQty(o.order_item_id),
    }));
    if (!confirm(`Xác nhận thanh toán ${checkedQtyTotal} ly?`)) return;
    checkout(items).then(() => {
      setChecked({});
      setPayQty({});
    });
  };

  if (orders.length === 0) return null;

  const allChecked =
    orders.length > 0 && orders.every((o) => checked[o.order_item_id]);

  return (
    <div className="mt-6 border border-amber-200 rounded-xl p-4 bg-amber-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-amber-800">
          🧾 Đơn chưa thanh toán
        </h2>
        <label className="flex items-center gap-2 text-sm text-amber-700 cursor-pointer">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="w-4 h-4"
          />
          Chọn tất cả
        </label>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {orders.map((item) => {
          const qty = getPayQty(item.order_item_id);
          return (
            <div
              key={item.order_item_id}
              className={`flex items-center gap-3 p-3 rounded-xl border bg-white transition-colors ${
                checked[item.order_item_id]
                  ? "border-amber-400"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={!!checked[item.order_item_id]}
                onChange={() => toggleItem(item.order_item_id)}
                className="w-4 h-4 flex-shrink-0"
              />
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-contain bg-white flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                  ☕
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {item.name}
                </p>
                {item.note && (
                  <p className="text-xs text-gray-400">Ghi chú: {item.note}</p>
                )}
                <p className="text-xs text-gray-400">
                  Đã gọi: {item.quantity} ly
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-xs text-gray-400">Trả:</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPayQty((prev) => ({
                        ...prev,
                        [item.order_item_id]: Math.max(1, qty - 1),
                      }))
                    }
                    disabled={qty <= 1}
                    className={`w-6 h-6 rounded-full text-sm flex items-center justify-center transition-colors ${
                      qty <= 1
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setPayQty((prev) => ({
                        ...prev,
                        [item.order_item_id]: Math.min(item.quantity, qty + 1),
                      }))
                    }
                    disabled={qty >= item.quantity}
                    className={`w-6 h-6 rounded-full text-sm flex items-center justify-center transition-colors ${
                      qty >= item.quantity
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs font-bold text-red-600">
                  {Number(item.price * qty).toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {checkedItems.length > 0 && (
        <div className="border-t border-amber-200 pt-3">
          <div className="flex justify-between font-bold text-amber-800 mb-3">
            <span>Tổng thanh toán ({checkedQtyTotal} ly):</span>
            <span className="text-red-600">
              {Number(checkedTotal).toLocaleString("vi-VN")}đ
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 font-medium transition-colors"
          >
            Thanh toán {checkedQtyTotal} ly đã chọn
          </button>
        </div>
      )}
    </div>
  );
}

export default BillPanel;
