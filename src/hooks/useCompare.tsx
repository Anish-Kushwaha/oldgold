import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CompareItem {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  image_url: string | null;
  category: string;
  condition: string;
  brand: string | null;
  power_rating: string | null;
  size: string | null;
  description: string | null;
}

interface CompareContextType {
  items: CompareItem[];
  addToCompare: (product: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  totalItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);
const COMPARE_KEY = "oldgold_compare";
const MAX = 4;

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CompareItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCompare = (product: CompareItem) => {
    setItems(prev => {
      if (prev.length >= MAX || prev.some(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };
  const removeFromCompare = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const isInCompare = (id: string) => items.some(i => i.id === id);
  const clearCompare = () => setItems([]);
  const totalItems = items.length;

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, isInCompare, clearCompare, totalItems }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
