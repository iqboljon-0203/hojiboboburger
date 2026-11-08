"use client";

import React from "react";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";

export type NavTab = "home" | "menu" | "orders" | "favorites" | "profile";

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCart: () => void;
}

export function BottomNavigation({
  currentTab,
  onSelectTab,
  onOpenCart,
}: BottomNavigationProps) {
  const { totalCount } = useCart();
  const { triggerHaptic } = useTelegram();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none">
      {/* Container with rounded top edges, soft border, backdrop blur */}
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-between pointer-events-auto">
        {/* 1. Home */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onSelectTab("home");
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === "home" ? "text-orange-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Asosiy</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onSelectTab("menu");
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === "menu" ? "text-orange-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menyu</span>
        </button>

        {/* 3. Center Elevated Cart Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => {
              triggerHaptic("medium");
              onOpenCart();
            }}
            className="w-13 h-13 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg shadow-orange-600/35 ring-4 ring-white active:scale-90 transition-all relative"
            aria-label="Savatchani ochish"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-white text-orange-600 border border-orange-500 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* 4. Favorites */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onSelectTab("favorites");
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative ${
            currentTab === "favorites" ? "text-orange-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Saralangan</span>
        </button>

        {/* 5. Profile / Orders */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onSelectTab("profile");
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === "profile" ? "text-orange-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>
      </div>
    </div>
  );
}
