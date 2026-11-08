"use client";

import React from "react";
import { Clock, ChefHat, Bike, ChevronRight } from "lucide-react";
import { PlacedOrder } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { formatPrice } from "@/utils/format";

interface ActiveOrderTrackerProps {
  order: PlacedOrder;
  onOpenDetails: (order: PlacedOrder) => void;
}

export function ActiveOrderTracker({ order, onOpenDetails }: ActiveOrderTrackerProps) {
  const { triggerHaptic } = useTelegram();

  return (
    <div className="px-4 py-1.5">
      <div
        onClick={() => {
          triggerHaptic("light");
          onOpenDetails(order);
        }}
        className="bg-white rounded-3xl p-3.5 border border-red-200/80 shadow-md shadow-red-900/5 hover:border-red-400 transition-all cursor-pointer active:scale-[0.99] relative overflow-hidden"
      >
        {/* Subtle top indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-amber-500 to-emerald-500" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black shrink-0 ring-2 ring-red-100">
              <ChefHat className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">
                  Buyurtma #{order.orderId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-700">
                  Tayyorlanmoqda
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Oshxona Josper ko&apos;mir pechida taomingizni pishirmoqda 🔥
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-xs font-bold text-slate-900">
              {formatPrice(order.totalAmount)}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Progress Timeline Indicator */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[10px]">
          <div className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1" />
            <span className="font-bold text-emerald-700">Qabul qilindi</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping mb-1" />
            <span className="font-bold text-red-700">Oshxonada</span>
          </div>
          <div className="flex flex-col items-center opacity-40">
            <span className="w-2 h-2 rounded-full bg-slate-300 mb-1" />
            <span className="text-slate-500">Yetkazish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
