import { useState, useCallback } from "react";

export function useTableOrders(tableNumber) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(() => {
    fetch(`http://localhost:3000/api/orders/table/${tableNumber}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []));
  }, [tableNumber]);

  const checkout = (items) => {
    // items = [{ order_item_id, quantity }]
    return fetch("http://localhost:3000/api/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).then(() => fetchOrders());
  };

  return { orders, fetchOrders, checkout };
}
