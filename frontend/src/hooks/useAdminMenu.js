import { useEffect, useState } from "react";

export function useAdminMenu() {
  const [menu, setMenu] = useState([]);

  const fetchMenu = () => {
    fetch("http://localhost:3000/api/menu/admin")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const updateItem = (id, data) => {
    return fetch(`http://localhost:3000/api/menu/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => fetchMenu());
  };

  const addItem = (data) => {
    return fetch("http://localhost:3000/api/menu/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => fetchMenu());
  };

  const deleteItem = (id) => {
    return fetch(`http://localhost:3000/api/menu/admin/${id}`, {
      method: "DELETE",
    }).then(() => fetchMenu());
  };

  return { menu, updateItem, addItem, deleteItem };
}
