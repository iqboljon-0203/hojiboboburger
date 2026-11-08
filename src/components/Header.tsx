"use client";

import React, { useState } from "react";
import { brandConfig } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import {
  Menu,
  Bell,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Info,
  Clock,
  Phone,
  Send,
  X,
} from "lucide-react";

interface HeaderProps {
  onOpenAddressModal: () => void;
  onOpenCart: () => void;
  onNavigateTab: (tab: "home" | "menu" | "orders" | "favorites" | "profile") => void;
}

export function Header({
  onOpenAddressModal,
  onOpenCart,
  onNavigateTab,
}: HeaderProps) {
  const { totalCount, selectedAddress, orders } = useCart();
  const { triggerHaptic, user } = useTelegram();
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <header className="pt-3 px-4 pb-2 bg-[#FBF9F5] sticky top-0 z-30 transition-all">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Menu button */}
          <button
            onClick={() => {
              triggerHaptic("light");
              setShowInfoDrawer(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
            aria-label="Menyu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand & Greeting */}
          <div className="flex-1 text-center px-1">
            <p className="text-[11px] font-medium text-amber-800 flex items-center justify-center gap-1">
              <span>{user ? `Salom, ${user.first_name}! 👋` : brandConfig.brandGreeting}</span>
            </p>
            <h1 className="text-lg font-black tracking-tight text-orange-600 uppercase flex items-center justify-center gap-1">
              <span>{brandConfig.brandName}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5 truncate max-w-[190px] mx-auto">
              {brandConfig.brandTagline}
            </p>
          </div>

          {/* Right Action Icons: Bell & Cart */}
          <div className="flex items-center gap-1.5">
            {/* Bell button */}
            <button
              onClick={() => {
                triggerHaptic("light");
                setShowNotificationModal(true);
              }}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 relative active:scale-95 transition-transform"
              aria-label="Bildirishnomalar"
            >
              <Bell className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Cart shortcut */}
            <button
              onClick={() => {
                triggerHaptic("medium");
                onOpenCart();
              }}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 relative active:scale-95 transition-transform"
              aria-label="Savatcha"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Delivery Address Pill */}
        <div className="mt-3">
          <button
            onClick={() => {
              triggerHaptic("light");
              onOpenAddressModal();
            }}
            className="w-full bg-white hover:bg-slate-50/80 rounded-2xl p-2.5 px-3 border border-slate-100/80 shadow-xs flex items-center justify-between text-left transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Yetkazib berish manzili
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {selectedAddress || brandConfig.defaultAddress}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400 pl-2 shrink-0">
              <span className="text-[11px] font-medium text-orange-600 hidden sm:inline">O&apos;zgartirish</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        </div>
      </header>

      {/* Brand Info Side Drawer */}
      {showInfoDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowInfoDrawer(false)}
          />
          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-lg">
                    CH
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{brandConfig.brandName}</h3>
                    <p className="text-[11px] text-slate-400">{brandConfig.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoDrawer(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Yetkazib berish vaqti</div>
                    <div className="text-slate-500 mt-0.5">{brandConfig.deliveryTime} (Issiq holatda)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Bepul yetkazib berish</div>
                    <div className="text-slate-500 mt-0.5">
                      {brandConfig.freeDeliveryThreshold.toLocaleString()} so&apos;mdan ortiq buyurtmalar uchun
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Telefon raqam</div>
                    <a href={`tel:${brandConfig.phoneNumber}`} className="text-blue-600 font-medium">
                      {brandConfig.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Send className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Telegram kanal</div>
                    <span className="text-sky-600 font-medium">{brandConfig.telegramChannel}</span>
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => {
                    setShowInfoDrawer(false);
                    onNavigateTab("menu");
                  }}
                  className="w-full text-left py-2 px-3 rounded-xl hover:bg-orange-50 font-semibold text-slate-700 hover:text-orange-600"
                >
                  🍔 To&apos;liq Menyu
                </button>
                <button
                  onClick={() => {
                    setShowInfoDrawer(false);
                    onNavigateTab("orders");
                  }}
                  className="w-full text-left py-2 px-3 rounded-xl hover:bg-orange-50 font-semibold text-slate-700 hover:text-orange-600"
                >
                  📦 Mening Buyurtmalarim
                </button>
                <button
                  onClick={() => {
                    setShowInfoDrawer(false);
                    onNavigateTab("favorites");
                  }}
                  className="w-full text-left py-2 px-3 rounded-xl hover:bg-orange-50 font-semibold text-slate-700 hover:text-orange-600"
                >
                  ❤️ Saralangan Taomlar
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pb-2">
              Telegram Mini App v1.0 • White-Label Demo
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowNotificationModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Bildirishnomalar
              </h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-800">🎉 Xush kelibsiz!</span>
                  <span className="text-[10px] text-orange-600">Hozir</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  {brandConfig.brandName} Mini App orqali birinchi buyurtmangiz uchun tezkor yetkazib berish xizmatidan bahramand bo&apos;ling!
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">🛵 Buyurtma holati</span>
                    <span className="text-[10px] text-emerald-600">Faol</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">
                    Oxirgi buyurtmangiz (#{orders[0].orderId}) oshxonada mehr bilan tayyorlanmoqda.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-700">⚡ Aksiya</div>
                  <p className="text-xs text-slate-500 mt-1">
                    70 000 so&apos;mdan yuqori har qanday buyurtma bepul yetkazib beriladi.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-transform"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </>
  );
}
