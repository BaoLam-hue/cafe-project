import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return { categories };
}
