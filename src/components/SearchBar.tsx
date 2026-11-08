"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTelegram } from "@/hooks/useTelegram";

export type FilterType = "all" | "spicy" | "popular" | "new" | "discount";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: SearchBarProps) {
  const { triggerHaptic } = useTelegram();
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filterOptions: { id: FilterType; label: string; icon: string }[] = [
    { id: "all", label: "Barchasi", icon: "✨" },
    { id: "popular", label: "Ommabop", icon: "🔥" },
    { id: "discount", label: "Chegirmada", icon: "🏷️" },
    { id: "spicy", label: "Achchiq", icon: "🌶️" },
    { id: "new", label: "Yangi", icon: "🆕" },
  ];

  return (
    <div className="px-4 py-2">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Taom yoki pitsalarni qidiring..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => {
            triggerHaptic("light");
            setShowFilterModal(true);
          }}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs transition-all active:scale-95 ${
            selectedFilter !== "all"
              ? "bg-orange-600 text-white border-orange-600"
              : "bg-white text-slate-700 border-slate-100"
          }`}
          aria-label="Filtrlar"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips Horizontal scroll */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-0.5">
        {filterOptions.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => {
                triggerHaptic("light");
                onFilterChange(filter.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all active:scale-95 ${
                isActive
                  ? "bg-orange-600 text-white shadow-xs shadow-orange-500/25"
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowFilterModal(false)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Saralash va Filtrlar</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    triggerHaptic("light");
                    onFilterChange(opt.id);
                    setShowFilterModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all ${
                    selectedFilter === opt.id
                      ? "bg-orange-50 border border-orange-200 text-orange-600 font-bold"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {selectedFilter === opt.id && (
                    <span className="w-2 h-2 rounded-full bg-orange-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onFilterChange("all");
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Tozalash
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Qo&apos;llash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
