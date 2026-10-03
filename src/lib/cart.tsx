import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  /** Last known stock level; quantity is never allowed above this. */
  stockQuantity: number;
};

type StockInfo = { id: number; stock_quantity: number; price: string | number; name: string; image_url: string | null };

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  hydrated: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  syncWithProducts: (products: StockInfo[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kasuwa-cart";

function clamp(qty: number, stock: number) {
  return Math.max(0, Math.min(Math.floor(qty), Math.max(0, stock)));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            (parsed as CartItem[])
              .filter((i) => i && typeof i.productId === "number" && i.quantity > 0)
              .map((i) => ({
                ...i,
                stockQuantity: typeof i.stockQuantity === "number" ? i.stockQuantity : i.quantity,
              })),
          );
        }
      }
    } catch {
      // Ignore malformed storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable; cart still works in memory.
    }
  }, [items, hydrated]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((e) => e.productId === item.productId);
      if (existing) {
        return prev.map((e) =>
          e.productId === item.productId
            ? { ...e, ...item, quantity: clamp(e.quantity + 1, item.stockQuantity) || e.quantity }
            : e,
        );
      }
      if (item.stockQuantity <= 0) return prev;
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev
        .map((e) => (e.productId === productId ? { ...e, quantity: clamp(quantity, e.stockQuantity) } : e))
        .filter((e) => e.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((e) => e.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const syncWithProducts = useCallback((products: StockInfo[]) => {
    const byId = new Map(products.map((p) => [p.id, p]));
    setItems((prev) => {
      let changed = false;
      const next = prev
        .filter((e) => {
          const keep = byId.has(e.productId);
          if (!keep) changed = true;
          return keep;
        })
        .map((e) => {
          const p = byId.get(e.productId)!;
          const stock = p.stock_quantity;
          const price = Number(p.price);
          const quantity = clamp(e.quantity, stock);
          if (stock !== e.stockQuantity || price !== e.price || quantity !== e.quantity || p.name !== e.name || p.image_url !== e.imageUrl) {
            changed = true;
            return { ...e, stockQuantity: stock, price, quantity, name: p.name, imageUrl: p.image_url };
          }
          return e;
        });
      return changed ? next : prev;
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((t, i) => t + i.quantity, 0),
      total: items.reduce((t, i) => t + i.quantity * i.price, 0),
      hydrated,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
      syncWithProducts,
    }),
    [items, hydrated, addToCart, setQuantity, removeItem, clearCart, syncWithProducts],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
