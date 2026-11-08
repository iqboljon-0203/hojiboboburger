"use client";

import React from "react";
import { CheckCircle2, Clock, MapPin, Receipt, Phone, Send, ArrowRight } from "lucide-react";
import { PlacedOrder } from "@/context/CartContext";
import { brandConfig } from "@/config/brand";
import { formatPrice } from "@/utils/format";
import { useTelegram } from "@/hooks/useTelegram";

interface OrderSuccessModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const { triggerHaptic } = useTelegram();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Celebration header */}
        <div className="text-center pt-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner ring-4 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Muvaffaqiyatli qabul qilindi
          </span>
          <h2 className="text-base font-black text-slate-800 mt-1">
            Buyurtma #{order.orderId}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Oshxona va kuryerlar tizimiga uzatildi!
          </p>
        </div>

        {/* Live Status Step */}
        <div className="mt-4 p-3 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 animate-spin text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-orange-950">
              Taxminiy yetkazish: {brandConfig.deliveryTime}
            </div>
            <div className="text-[10px] text-orange-800 mt-0.5">
              Oshpazlarimiz taomingizni tayyorlamoqda 👨‍🍳
            </div>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        <div className="mt-3 overflow-y-auto max-h-56 no-scrollbar bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold border-b border-slate-200/60 pb-1.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <span>Buyurtma tafsilotlari</span>
          </div>

          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-600 text-[11px]">
                <span className="truncate pr-2">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-semibold text-slate-800 shrink-0">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
            <div className="flex items-center justify-between">
              <span>Manzil:</span>
              <span className="text-slate-800 font-medium truncate max-w-[170px]">
                {order.address}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>To&apos;lov turi:</span>
              <span className="text-slate-800 font-bold uppercase">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between font-black text-xs text-slate-900 pt-1 border-t border-dashed border-slate-200">
              <span>Jami summa:</span>
              <span className="text-orange-600 text-sm">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic("medium");
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/25 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Yana buyurtma berish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
