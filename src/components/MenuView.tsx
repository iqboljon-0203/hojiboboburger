"use client";

import React from "react";
import { brandConfig, Product } from "@/config/brand";
import { ProductCard } from "@/components/ProductCard";
import { FilterType } from "@/components/SearchBar";

interface MenuViewProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  selectedFilter: FilterType;
  onOpenDetails: (p: Product) => void;
}

export function MenuView({
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  selectedFilter,
  onOpenDetails,
}: MenuViewProps) {
  // Filter products by category, search query, and special filters
  const filteredProducts = brandConfig.products.filter((p) => {
    // Category check
    if (selectedCategoryId !== "all" && p.categoryId !== selectedCategoryId) {
      return false;
    }

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // Special filters
    if (selectedFilter === "spicy" && !p.isSpicy) return false;
    if (selectedFilter === "popular" && p.badge !== "Xit" && p.badge !== "Top") return false;
    if (selectedFilter === "new" && p.badge !== "Yangi") return false;
    if (selectedFilter === "discount" && !p.oldPrice && !p.badge?.includes("%")) return false;

    return true;
  });

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Category Pills Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {brandConfig.categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-orange-600 text-white shadow-xs shadow-orange-600/30"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <span>{cat.icon}</span> <span className="ml-1">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-800">
          {selectedCategoryId === "all"
            ? "Barcha Taomlar"
            : brandConfig.categories.find((c) => c.id === selectedCategoryId)?.name}
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {filteredProducts.length} ta taom
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 my-6">
          <p className="text-slate-400 text-xs">
            So&apos;rovingiz bo&apos;yicha hech qanday taom topilmadi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((prod) => (
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
