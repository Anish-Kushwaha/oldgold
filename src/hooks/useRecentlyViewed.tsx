import { useState, useEffect } from "react";

const RECENT_KEY = "oldgold_recently_viewed";
const MAX_ITEMS = 10;

export interface RecentItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: RecentItem) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [item, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearHistory = () => setItems([]);

  return { items, addItem, clearHistory };
};
