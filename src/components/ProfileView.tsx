"use client";

import React from "react";
import {
  User,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Send,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { brandConfig } from "@/config/brand";
import { formatPrice } from "@/utils/format";
import { HojiBoboLogo } from "@/components/HojiBoboLogo";

interface ProfileViewProps {
  onOpenAddressModal: () => void;
  onExploreMenu: () => void;
  onOpenOnboarding?: () => void;
}

export function ProfileView({ onOpenAddressModal, onExploreMenu, onOpenOnboarding }: ProfileViewProps) {
  const { orders, selectedAddress } = useCart();
  const { user, triggerHaptic } = useTelegram();

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-orange-500/25">
          {user?.first_name ? user.first_name[0].toUpperCase() : "M"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-extrabold text-slate-800 text-sm truncate">
              {user ? `${user.first_name} ${user.last_name || ""}` : "Mijoz"}
            </h2>
            {user?.is_premium && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                ⭐ Premium
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
            {user?.username ? `@${user.username}` : "Telegram Mini App"}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
            <span>ID: {user?.id || "748921"}</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">Faol mijoz</span>
          </div>
        </div>
      </div>

      {/* Orders History Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>Buyurtmalar tarixi</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            {orders.length} ta buyurtma
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <p className="text-xs text-slate-400">Hozircha buyurtmalar berilmagan.</p>
            <button
              onClick={onExploreMenu}
              className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Taomlarni ko&apos;rish
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((ord) => (
              <div
                key={ord.orderId}
                className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <div>
                    <span className="font-extrabold text-xs text-slate-800">
                      Buyurtma #{ord.orderId}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {ord.createdAt}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Oshxonada tayyorlanmoqda
                  </span>
                </div>

                <div className="space-y-0.5 text-xs text-slate-600">
                  {ord.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[200px]">
                        {i.quantity}x {i.product.name}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatPrice(i.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="text-[11px] text-slate-400 font-normal">
                    To&apos;lov: {ord.paymentMethod.toUpperCase()}
                  </span>
                  <span className="text-orange-600 font-black">
                    {formatPrice(ord.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings & Info list */}
      <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
        <button
          onClick={() => {
            triggerHaptic("light");
            onOpenAddressModal();
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Asosiy manzil</div>
              <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {selectedAddress}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <a
          href={`https://instagram.com/${brandConfig.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <span className="text-xs font-black">IG</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Instagram sahifamiz</div>
              <div className="text-[11px] text-pink-600 font-medium">{brandConfig.instagram}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href={`tel:${brandConfig.phoneNumber}`}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Qo&apos;llab-quvvatlash xizmati</div>
              <div className="text-[11px] text-slate-400">{brandConfig.phoneNumber}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>

        <div className="p-3.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <span className="text-xs">🔥</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Josper Ko&apos;mir Pechi</div>
              <div className="text-[11px] text-slate-400">100% asl go&apos;sht va tabiiy ko&apos;mir tafti</div>
            </div>
          </div>
        </div>

        {onOpenOnboarding && (
          <button
            onClick={() => {
              triggerHaptic("light");
              onOpenOnboarding();
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                ✨
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Ilova tanishuvi (Onboarding)</div>
                <div className="text-[11px] text-slate-400">Kirish va yangiliklar lavhalari</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Brand Footer */}
      <div className="text-center pt-2 text-[10px] text-slate-400 space-y-1">
        <div className="flex justify-center pb-1">
          <HojiBoboLogo size={42} />
        </div>
        <p className="font-extrabold text-slate-600">
          {brandConfig.brandName} • {brandConfig.brandSubName}
        </p>
        <p className="text-[10px] text-slate-400">
          {brandConfig.city} shahri bo&apos;ylab tezkor yetkazib berish
        </p>
      </div>
    </div>
  );
}
