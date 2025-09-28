import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {productId, qty}
  const [mode, setMode] = useState('delivery'); // 'delivery' | 'pickup'
  const [pickupBranchId, setPickupBranchId] = useState(null);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', city: '', state: 'Telangana', pincode: '' });

  const addItem = (productId, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { productId, qty }];
    });
  };

  const removeItem = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId));
  const updateQty = (productId, qty) => setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  const clear = () => setItems([]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    mode,
    setMode,
    pickupBranchId,
    setPickupBranchId,
    address,
    setAddress,
  }), [items, mode, pickupBranchId, address]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
