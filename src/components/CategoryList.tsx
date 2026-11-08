"use client";

import React from "react";
import Image from "next/image";
import { brandConfig } from "@/config/brand";
import { useTelegram } from "@/hooks/useTelegram";

interface CategoryListProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryList({
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  const { triggerHaptic } = useTelegram();
  const categories = brandConfig.categories;

  return (
    <div className="py-2">
      <div className="flex items-center gap-3.5 px-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic("light");
                onSelectCategory(cat.id);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
            >
              {/* Circular Avatar */}
              <div
                className={`relative w-15 h-15 rounded-full p-0.5 transition-all duration-200 ${
                  isActive
                    ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-[#FBF9F5] scale-105"
                    : "ring-1 ring-slate-200/80 group-hover:ring-orange-300"
                }`}
              >
                <div
                  style={{ position: "relative" }}
                  className="w-full h-full rounded-full overflow-hidden bg-white shadow-xs"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="60px"
                  />
                  {/* Category Emoji Badge in corner */}
                  <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-white/95 rounded-full text-[10px] flex items-center justify-center shadow-xs">
                    {cat.icon}
                  </span>
                </div>
              </div>

              {/* Category Name */}
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
                  isActive ? "text-orange-600 font-bold" : "text-slate-600"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
