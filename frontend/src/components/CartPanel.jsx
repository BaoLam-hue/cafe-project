function CartPanel({ cart, total, onRemove, onOrder, tableNumber }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-bold mb-3">🛒 Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p className="text-gray-300 text-sm">Chưa có món nào</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-2 text-sm"
            >
              <span>
                {item.name}{" "}
                <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span>
                {Number(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="bg-red-500 text-white text-xs rounded px-2 py-0.5"
              >
                Xóa
              </button>
            </div>
          ))}
          <hr className="my-3" />
          <div className="flex justify-between font-bold">
            <span>Tổng:</span>
            <span className="text-red-600">
              {Number(total).toLocaleString("vi-VN")}đ
            </span>
          </div>
          <button
            onClick={onOrder}
            className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 font-medium transition-colors"
          >
            Đặt đơn cho bàn {tableNumber}
          </button>
        </>
      )}
    </div>
  );
}

export default CartPanel;
