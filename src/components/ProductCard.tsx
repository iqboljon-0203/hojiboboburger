"use client";

import React from "react";
import Image from "next/image";
import { Heart, Plus, Minus, Star } from "lucide-react";
import { Product } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (p: Product) => void;
}

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { toggleFavorite, isFavorite, addItem, updateQuantity, items } = useCart();
  const { triggerHaptic } = useTelegram();

  const isLiked = isFavorite(product.id);

  // Check how many items of this product are in cart (simple cart quantity check)
  const productItemsInCart = items.filter((i) => i.product.id === product.id);
  const totalQuantity = productItemsInCart.reduce((sum, i) => sum + i.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");

    // If product has complex sizes or addons, open details modal instead
    if ((product.sizes && product.sizes.length > 1) || (product.addons && product.addons.length > 0)) {
      onOpenDetails(product);
      return;
    }

    // Default simple add
    const defaultSize = product.sizes?.[0] || null;
    addItem(product, defaultSize, []);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    if (productItemsInCart.length > 0) {
      updateQuantity(productItemsInCart[0].id, 1);
    } else {
      addItem(product, product.sizes?.[0] || null, []);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    if (productItemsInCart.length > 0) {
      updateQuantity(productItemsInCart[0].id, -1);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    toggleFavorite(product.id);
  };

  // Badge background color helper
  const getBadgeStyle = () => {
    switch (product.badgeColor) {
      case "red":
        return "bg-rose-500 text-white";
      case "yellow":
        return "bg-amber-400 text-amber-950";
      case "green":
        return "bg-emerald-500 text-white";
      case "orange":
      default:
        return "bg-orange-500 text-white";
    }
  };

  return (
    <div
      onClick={() => {
        triggerHaptic("light");
        onOpenDetails(product);
      }}
      className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group active:scale-[0.98] relative"
    >
      {/* Top Floating Row: Badge & Heart */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span
            className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider shadow-xs pointer-events-auto ${getBadgeStyle()}`}
          >
            {product.badge}
          </span>
        ) : (
          <div />
        )}

        <button
          onClick={handleToggleFavorite}
          className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xs pointer-events-auto active:scale-90 transition-transform"
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
          />
        </button>
      </div>

      {/* Image container */}
      <div>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-2.5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 250px"
          />
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Short description */}
        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
          {product.description}
        </p>

        {/* Rating and review count */}
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-700">
            {product.rating}
          </span>
          <span className="text-[10px] text-slate-400">
            ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-50">
        <div>
          {product.oldPrice && (
            <span className="text-[10px] text-slate-400 line-through block -mb-0.5">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add button or counter */}
        {totalQuantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center bg-orange-50 border border-orange-200 rounded-full p-0.5 shadow-xs"
          >
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              aria-label="Kamaytirish"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-orange-600">
              {totalQuantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              aria-label="Ko'paytirish"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md shadow-orange-600/30 active:scale-90 transition-all"
            aria-label="Savatga qo'shish"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
