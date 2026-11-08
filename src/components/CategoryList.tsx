"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll state & arrow visibility
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartPos, setScrollStartPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Update left/right scroll arrow visibility
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Set up listeners for scroll, resize, and mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    // 1. Native non-passive wheel listener:
    // Enables horizontal scrolling when mouse wheel is turned over categories
    const onWheelNative = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.3;
        updateScrollButtons();
      }
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("wheel", onWheelNative);
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // Click scroll buttons
  const scrollByAmount = (offset: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(updateScrollButtons, 350);
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStartPos(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const currentX = e.pageX - scrollRef.current.offsetLeft;
    const walk = (currentX - startX) * 1.4;

    if (Math.abs(currentX - startX) > 6) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollStartPos - walk;
    updateScrollButtons();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Category select handler (ignores clicks that were drags)
  const handleSelect = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasDragged) {
      // User was dragging to scroll sideways, do not select category
      return;
    }

    triggerHaptic("light");
    onSelectCategory(catId);

    // Scroll selected category into center view smoothly
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="py-2 relative group/carousel">
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-180)}
          aria-label="Scroll left"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all backdrop-blur-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(180)}
          aria-label="Scroll right"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all backdrop-blur-xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* Left Soft Edge Gradient Fade */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FBF9F5] to-transparent z-10 pointer-events-none" />
      )}

      {/* Right Soft Edge Gradient Fade */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FBF9F5] to-transparent z-10 pointer-events-none" />
      )}

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-start gap-3.5 px-4 overflow-x-auto no-scrollbar scroll-smooth select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x proximity",
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={(e) => handleSelect(cat.id, e)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-hidden transition-all active:scale-95 scroll-snap-align-center"
              style={{ minWidth: "76px", maxWidth: "96px" }}
            >
              {/* Circular Avatar with Full Filled Glowing Active Frame */}
              <div
                className={`relative w-[68px] h-[68px] rounded-full p-[3px] transition-all duration-300 flex items-center justify-center shrink-0 ${
                  isActive
                    ? "bg-linear-to-tr from-red-600 via-orange-500 to-amber-400 shadow-lg shadow-red-600/40 scale-105"
                    : "bg-slate-200/90 border border-slate-300/40 group-hover:bg-slate-300"
                }`}
              >
                {/* Inner Image Container without white gaps */}
                <div
                  style={{ position: "relative" }}
                  className="w-full h-full rounded-full overflow-hidden bg-white"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    draggable={false}
                    className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                    sizes="68px"
                  />

                  {/* Subtle active warm overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
                  )}

                  {/* Corner Badge: Filled checkmark if active, emoji if inactive */}
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10 transition-all ${
                      isActive
                        ? "bg-linear-to-tr from-red-600 to-orange-500 text-white scale-110"
                        : "bg-white text-slate-700 text-[10px]"
                    }`}
                  >
                    {isActive ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span>{cat.icon}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Name as a filled pill badge */}
              <span
                className={`text-[11px] text-center leading-tight transition-all duration-200 line-clamp-2 px-2.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-linear-to-r from-red-600 via-red-500 to-orange-500 text-white font-black shadow-md shadow-red-600/30 scale-105"
                    : "bg-white/80 text-slate-700 font-semibold border border-slate-200/70 group-hover:bg-white group-hover:text-slate-900"
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
