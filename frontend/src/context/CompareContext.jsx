import { createContext, useContext, useEffect, useState } from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "vibetouch_compare";
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [atCapacity, setAtCapacity] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Auto-dismiss the "remove one to add another" notice.
  useEffect(() => {
    if (!atCapacity) return;
    const t = setTimeout(() => setAtCapacity(false), 2800);
    return () => clearTimeout(t);
  }, [atCapacity]);

  function toggle(product) {
    const exists = items.some((p) => p.slug === product.slug);
    if (!exists && items.length >= MAX_COMPARE) {
      setAtCapacity(true);
      return;
    }
    setItems((current) => {
      const stillExists = current.some((p) => p.slug === product.slug);
      if (stillExists) return current.filter((p) => p.slug !== product.slug);
      if (current.length >= MAX_COMPARE) return current;
      return [...current, product];
    });
  }

  function remove(slug) {
    setItems((current) => current.filter((p) => p.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const isSelected = (slug) => items.some((p) => p.slug === slug);

  return (
    <CompareContext.Provider
      value={{ items, toggle, remove, clear, isSelected, maxCompare: MAX_COMPARE, atCapacity }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
