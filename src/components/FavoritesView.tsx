"use client";

import React from "react";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { brandConfig, Product } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";

interface FavoritesViewProps {
  onOpenDetails: (p: Product) => void;
  onExploreMenu: () => void;
}

export function FavoritesView({
  onOpenDetails,
  onExploreMenu,
}: FavoritesViewProps) {
  const { favorites } = useCart();

  const favoriteProducts = brandConfig.products.filter((p) =>
    favorites.includes(p.id)
  );

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Saralangan Taomlar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sizga yoqqan sevimli lazzatlar ro&apos;yxati
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
          {favoriteProducts.length} ta
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 flex flex-col items-center justify-center my-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mb-3">
            ❤️
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Hozircha sevimli taomlar yo&apos;q
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
            Taom kartochkasidagi yurakcha ustiga bosib sevimli taomlaringizni saqlang!
          </p>
          <button
            onClick={onExploreMenu}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5"
          >
            <span>Menyuni ko&apos;rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
