import { useState } from "react";
import { useAdminMenu } from "../hooks/useAdminMenu";
import { useCategories } from "../hooks/useCategories";

function AdminPage() {
  const { menu, updateItem, addItem, deleteItem } = useAdminMenu();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const { categories } = useCategories();
  const [form, setForm] = useState({
    name: "",
    category: "cafe",
    price: "",
    image_url: "",
    is_available: 1,
  });

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      image_url: item.image_url || "",
      is_available: item.is_available,
    });
  };

  const handleUpdate = (id) => {
    updateItem(id, form).then(() => setEditing(null));
  };

  const handleAdd = () => {
    if (!form.name || !form.price) return alert("Vui lòng nhập tên và giá!");
    addItem(form).then(() => {
      setAdding(false);
      setForm({
        name: "",
        category: "cafe",
        price: "",
        image_url: "",
        is_available: 1,
      });
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">⚙️ Quản lý Menu</h1>
        <button
          onClick={() => {
            setAdding(true);
            setEditing(null);
            setForm({
              name: "",
              category: "cafe",
              price: "",
              image_url: "",
              is_available: 1,
            });
          }}
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm transition-colors"
        >
          + Thêm món mới
        </button>
      </div>

      {/* Form thêm món mới */}
      {adding && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold mb-3 text-green-700">Món mới</h2>
          <FormFields form={form} setForm={setForm} categories={categories} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white rounded-lg px-4 py-1.5 text-sm"
            >
              Lưu
            </button>
            <button
              onClick={() => setAdding(false)}
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-1.5 text-sm"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* Danh sách món */}
      <div className="flex flex-col gap-3">
        {menu.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-4">
            {editing === item.id ? (
              <>
                <FormFields
                  form={form}
                  setForm={setForm}
                  categories={categories}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-blue-500 text-white rounded-lg px-4 py-1.5 text-sm"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-200 text-gray-700 rounded-lg px-4 py-1.5 text-sm"
                  >
                    Huỷ
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xl">
                      ☕
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.category} ·{" "}
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${item.is_available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                    >
                      {item.is_available ? "Đang bán" : "Đã ẩn"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5 text-sm transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Xóa món này?")) deleteItem(item.id);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-500 rounded-lg px-3 py-1.5 text-sm transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component form dùng chung cho thêm và sửa
function FormFields({ form, setForm, categories }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="text-xs text-gray-500 mb-1 block">Tên món</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Cà phê sữa đá"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Giá (đ)</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="35000"
        />
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500 mb-1 block">
          Link ảnh (URL)
        </label>
        <input
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_available === 1}
          onChange={(e) =>
            setForm({ ...form, is_available: e.target.checked ? 1 : 0 })
          }
          id="is_available"
        />
        <label htmlFor="is_available" className="text-sm text-gray-600">
          Đang bán
        </label>
      </div>
    </div>
  );
}

export default AdminPage;
