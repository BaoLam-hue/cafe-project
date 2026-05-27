function MenuGrid({ menu, onAdd }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {menu.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2"
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-32 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
              ☕
            </div>
          )}
          <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
          <p className="text-red-600 font-bold text-sm">
            {Number(item.price).toLocaleString("vi-VN")}đ
          </p>
          <button
            onClick={() => onAdd(item)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 text-sm transition-colors"
          >
            + Thêm
          </button>
        </div>
      ))}
    </div>
  );
}

export default MenuGrid;
