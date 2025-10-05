import { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const addItem: CartState["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  const clear = () => setItems([]);

  const { totalQty, totalPrice } = useMemo(() => {
    const totalQty = items.reduce((acc, i) => acc + i.qty, 0);
    const totalPrice = items.reduce((acc, i) => acc + i.qty * i.price, 0);
    return { totalQty, totalPrice };
  }, [items]);

  const value: CartState = {
    items,
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    addItem,
    removeItem,
    updateQty,
    clear,
    totalQty,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
