import { useState, useEffect } from "react";

// useState that persists to localStorage (safe against parse/quota errors).
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Could not save "${key}" to localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}
