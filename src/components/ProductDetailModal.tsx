"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Star, Plus, Minus, Check, Flame } from "lucide-react";
import { Product, BrandSizeOption, BrandAddonOption } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { formatPrice } from "@/utils/format";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { triggerHaptic } = useTelegram();

  const [selectedSize, setSelectedSize] = useState<BrandSizeOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<BrandAddonOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Initialize defaults whenever product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedAddons([]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const toggleAddon = (addon: BrandAddonOption) => {
    triggerHaptic("light");
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleSizeChange = (size: BrandSizeOption) => {
    triggerHaptic("light");
    setSelectedSize(size);
  };

  const handleIncrement = () => {
    triggerHaptic("light");
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    triggerHaptic("light");
    setQuantity((q) => Math.max(1, q - 1));
  };

  // Calculate dynamic total price
  const basePrice = product.price;
  const sizePrice = selectedSize ? selectedSize.extraPrice : 0;
  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + sizePrice + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    triggerHaptic("medium");
    addItem(product, selectedSize, selectedAddons, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 pb-28 pt-1 no-scrollbar space-y-4">
          {/* Hero Image Container */}
          <div
            style={{ position: "relative" }}
            className="w-full aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 shadow-inner"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 450px"
              priority
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            {product.isSpicy && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Achchiq
              </span>
            )}
          </div>

          {/* Title & Ratings */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">
                  {product.rating}
                </span>
                <span className="text-[10px] text-amber-700">
                  ({product.reviewCount})
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size / Portion Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Hajm yoki porsiyani tanlang:
                </span>
                <span className="text-[10px] font-semibold text-orange-600">
                  Majburiy
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size)}
                      className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/80 text-orange-950 ring-1 ring-orange-500"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold">{size.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {size.extraPrice > 0 ? `+${formatPrice(size.extraPrice)}` : "Asosiy"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons / Toppings */}
          {product.addons && product.addons.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Qo&apos;shimchalar (ixtiyoriy):
                </span>
                <span className="text-[10px] text-slate-400">
                  Ko&apos;p tanlov mumkin
                </span>
              </div>
              <div className="space-y-1.5">
                {product.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isChecked
                          ? "border-orange-400 bg-orange-50/50 text-slate-900"
                          : "border-slate-100 bg-slate-50/60 text-slate-700 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-medium">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-orange-600 text-white"
                              : "border border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        +{formatPrice(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 px-5 shadow-lg flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 shrink-0">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center shadow-xs disabled:opacity-40 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-slate-800">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/30 flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <span>Savatga qo&apos;shish</span>
            <span className="font-extrabold">{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
