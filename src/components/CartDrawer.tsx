"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  Bike,
  Store,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { brandConfig } from "@/config/brand";
import { useCart, PaymentMethod, PlacedOrder } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { formatPrice } from "@/utils/format";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddressModal: () => void;
  onOrderSuccess: (order: PlacedOrder) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  onOpenAddressModal,
  onOrderSuccess,
}: CartDrawerProps) {
  const {
    items,
    totalCount,
    subtotal,
    deliveryFee,
    discount,
    finalTotal,
    orderType,
    setOrderType,
    selectedAddress,
    updateQuantity,
    removeItem,
    clearCart,
    addPlacedOrder,
  } = useCart();

  const { triggerHaptic, triggerNotification, user, sendDataToBot } = useTelegram();

  const [customerName, setCustomerName] = useState(
    user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : ""
  );
  const [customerPhone, setCustomerPhone] = useState("+998 ");
  const [courierNotes, setCourierNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("click");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    triggerHaptic("heavy");
    setIsSubmitting(true);

    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: PlacedOrder = {
      orderId: randomOrderNumber,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [...items],
      orderType,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      totalAmount: finalTotal,
      customerName: customerName.trim() || "Mijoz",
      customerPhone: customerPhone.trim() || "+998 90 000 00 00",
      address: orderType === "delivery" ? selectedAddress : "Kafedan olib ketish",
      notes: courierNotes,
      status: "kitchen",
    };

    try {
      // 1. Send data to Telegram Mini App host if running in Telegram
      sendDataToBot({
        action: "new_order",
        orderId: newOrder.orderId,
        totalAmount: newOrder.totalAmount,
        itemsCount: newOrder.items.length,
        address: newOrder.address,
      });

      // 2. Call server-side API to send notification to Telegram bot
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch((err) => console.warn("Order api warning:", err));
    } catch (e) {
      console.warn("Order submission notice:", e);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF5A1F", "#063F2E", "#F59E0B", "#10B981"],
      });
    } catch (e) {
      // Confetti fallback
    }

    triggerNotification("success");
    addPlacedOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
    onClose();
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base text-slate-800">Savatcha</h2>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
              {totalCount} ta
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🛒
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Savatchangiz bo&apos;sh</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Menyudan mazali taomlarni tanlang va buyurtma bering!
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/25 active:scale-95 transition-all"
            >
              Taomlarni tanlash
            </button>
          </div>
        ) : (
          /* Scrollable Cart Content */
          <div className="overflow-y-auto px-5 py-3 space-y-4 no-scrollbar pb-32">
            {/* Delivery type switcher: Delivery vs Pickup */}
            <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setOrderType("delivery");
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === "delivery"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Bike className="w-4 h-4 text-orange-500" />
                <span>Yetkazib berish</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setOrderType("pickup");
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === "pickup"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Olib ketish (-10%)</span>
              </button>
            </div>

            {/* Delivery notification threshold bar */}
            {orderType === "delivery" && (
              <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-orange-800">
                  <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    {subtotal >= brandConfig.freeDeliveryThreshold
                      ? "🎉 Sizga bepul yetkazib berish taqdim etildi!"
                      : `Yana ${formatPrice(
                          brandConfig.freeDeliveryThreshold - subtotal
                        )} buyurtma qilsangiz, yetkazib berish bepul!`}
                  </span>
                </div>
              </div>
            )}

            {/* Cart Items list */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tanlangan taomlar:
              </span>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-2.5 flex items-center gap-3 border border-slate-100/80"
                >
                  <div
                    style={{ position: "relative" }}
                    className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.product.name}
                    </h4>

                    {/* Size and Addons tags */}
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {item.selectedSize && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                          {item.selectedSize.name}
                        </span>
                      )}
                      {item.selectedAddons.map((addon) => (
                        <span
                          key={addon.id}
                          className="text-[9px] px-1.5 py-0.2 rounded-md bg-orange-100/80 text-orange-800 font-medium"
                        >
                          +{addon.name}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs shrink-0">
                    <button
                      onClick={() => {
                        triggerHaptic("light");
                        updateQuantity(item.id, -1);
                      }}
                      className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center active:scale-90"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic("light");
                        updateQuantity(item.id, 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center active:scale-90"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic("medium");
                      removeItem(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleOrderSubmit} id="checkout-form" className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Mijoz va Manzil ma&apos;lumotlari:
              </span>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Ismingiz:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masalan: Sardor"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Telefon raqam:
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Address selector if delivery */}
              {orderType === "delivery" ? (
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Yetkazib berish manzili:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onOpenAddressModal();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate text-slate-800 font-medium">
                        {selectedAddress}
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-600 font-bold shrink-0 ml-1">
                      O&apos;zgartirish
                    </span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Kafemizdan olib ketasiz:</span>
                    <span className="text-[11px] text-emerald-700">{brandConfig.defaultAddress}</span>
                  </div>
                </div>
              )}

              {/* Courier notes */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                  Kuryer uchun izoh (mo&apos;ljal, qavat, podyezd):
                </label>
                <input
                  type="text"
                  value={courierNotes}
                  onChange={(e) => setCourierNotes(e.target.value)}
                  placeholder="Masalan: 3-podyezd, 4-qavat, domofon ishlamaydi..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  To&apos;lov turi:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setPaymentMethod("click");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === "click"
                        ? "border-sky-500 bg-sky-50 text-sky-900 font-bold ring-1 ring-sky-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-black text-sky-600">CLICK</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Karta orqali</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setPaymentMethod("payme");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === "payme"
                        ? "border-teal-500 bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-black text-teal-600">PAYME</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Ilova orqali</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setPaymentMethod("cash");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === "cash"
                        ? "border-amber-500 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-700">NAQD</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Qabulda to&apos;lash</div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown Calculation */}
              <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taomlar summasi:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>

                {orderType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Yetkazib berish:</span>
                    <span className="font-semibold text-slate-800">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">Bepul</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Olib ketish chegirmasi (10%):</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Jami to&apos;lov:</span>
                  <span className="text-orange-600 text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Floating Confirm Button at Bottom */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 px-5 bg-white border-t border-slate-100 shadow-xl">
            <button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-600/30 flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Buyurtmani tasdiqlash</span>
              </div>
              <span>{formatPrice(finalTotal)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
