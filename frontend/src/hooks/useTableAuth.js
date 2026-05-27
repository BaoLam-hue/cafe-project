import { useEffect, useState } from "react";

export function useTableAuth(tableNumber, token) {
  const [valid, setValid] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/table/${tableNumber}?token=${token}`)
      .then((res) => {
        if (!res.ok) {
          setValid(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.valid) {
          setValid(true);
          fetch("http://localhost:3000/api/menu")
            .then((res) => res.json())
            .then((data) => setMenu(data));
        } else {
          setValid(false);
        }
      })
      .catch(() => setValid(false));
  }, [tableNumber, token]);

  return { valid, menu };
}
