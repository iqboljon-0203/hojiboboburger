"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { brandConfig, Product, BrandSizeOption, BrandAddonOption } from "@/config/brand";

export interface CartItem {
  id: string; // Unique cart item ID based on product + options
  product: Product;
  selectedSize: BrandSizeOption | null;
  selectedAddons: BrandAddonOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = "delivery" | "pickup";
export type PaymentMethod = "cash" | "click" | "payme";

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  address: string;
  notes: string;
  status: "new" | "kitchen" | "courier" | "delivered";
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedAddress: string;
  setSelectedAddress: (addr: string) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addItem: (
    product: Product,
    selectedSize: BrandSizeOption | null,
    selectedAddons: BrandAddonOption[],
    quantity?: number
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getItemQuantityInCart: (productId: string) => number;
  orders: PlacedOrder[];
  addPlacedOrder: (order: PlacedOrder) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [selectedAddress, setSelectedAddress] = useState<string>(brandConfig.defaultAddress);
  const [favorites, setFavorites] = useState<string[]>(["prod-1", "prod-3"]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("chinar_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedFavs = localStorage.getItem("chinar_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedOrders = localStorage.getItem("chinar_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedAddress = localStorage.getItem("chinar_address");
      if (savedAddress) setSelectedAddress(savedAddress);
    } catch (e) {
      console.warn("Storage load error:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("chinar_cart", JSON.stringify(items));
    } catch (e) {
      console.warn("Cart save error:", e);
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("chinar_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.warn("Favs save error:", e);
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("chinar_orders", JSON.stringify(orders));
    } catch (e) {
      console.warn("Orders save error:", e);
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("chinar_address", selectedAddress);
    } catch (e) {
      console.warn("Address save error:", e);
    }
  }, [selectedAddress, isLoaded]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addItem = (
    product: Product,
    selectedSize: BrandSizeOption | null,
    selectedAddons: BrandAddonOption[],
    quantity: number = 1
  ) => {
    const addonsKey = [...selectedAddons]
      .map((a) => a.id)
      .sort()
      .join("-");
    const cartItemId = `${product.id}_${selectedSize?.id || "default"}_${addonsKey}`;

    const sizeExtra = selectedSize ? selectedSize.extraPrice : 0;
    const addonsExtra = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + sizeExtra + addonsExtra;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            selectedSize,
            selectedAddons,
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => setItems([]);

  const getItemQuantityInCart = (productId: string) => {
    return items
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const addPlacedOrder = (newOrder: PlacedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.totalPrice, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (orderType === "pickup" || subtotal === 0) return 0;
    if (subtotal >= brandConfig.freeDeliveryThreshold) return 0;
    return brandConfig.deliveryFee;
  }, [orderType, subtotal]);

  const discount = useMemo(() => {
    if (orderType === "pickup" && subtotal > 0) {
      return Math.round((subtotal * brandConfig.pickupDiscountPercent) / 100);
    }
    return 0;
  }, [orderType, subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [subtotal, deliveryFee, discount]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        deliveryFee,
        discount,
        finalTotal,
        orderType,
        setOrderType,
        selectedAddress,
        setSelectedAddress,
        favorites,
        toggleFavorite,
        isFavorite,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantityInCart,
        orders,
        addPlacedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
