"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
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

  // Drag tracking without preventing legitimate clicks
  const dragInfo = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  // 1. Automatic scroll to active category whenever selectedCategoryId changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector<HTMLButtonElement>(
      `[data-category-id="${selectedCategoryId}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedCategoryId]);

  // 2. Native non-passive wheel listener:
  // Converts mouse wheel on desktop directly to smooth horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.25;
      }
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheelNative);
    };
  }, []);

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    dragInfo.current = {
      isDown: true,
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragInfo.current.isDown || !scrollRef.current) return;
    const currentX = e.pageX - scrollRef.current.offsetLeft;
    const distance = currentX - dragInfo.current.startX;

    // Only flag as drag if movement is significant (> 12px)
    if (Math.abs(distance) > 12) {
      dragInfo.current.hasMoved = true;
      e.preventDefault();
      scrollRef.current.scrollLeft = dragInfo.current.scrollLeft - distance * 1.3;
    }
  };

  const handleMouseUpOrLeave = () => {
    dragInfo.current.isDown = false;
  };

  // Category select handler (reliable click)
  const handleSelect = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // If the user distinctly dragged more than 12px, ignore the click
    if (dragInfo.current.hasMoved) {
      dragInfo.current.hasMoved = false;
      return;
    }

    triggerHaptic("light");
    onSelectCategory(catId);

    // Auto-scroll selected category into center
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="py-1 relative">
      {/* Horizontal Scrollable Row with generous vertical headroom */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-3.5 px-4 py-4 overflow-x-auto no-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing"
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
              data-category-id={cat.id}
              onClick={(e) => handleSelect(cat.id, e)}
              title={cat.name}
              aria-label={cat.name}
              className="relative shrink-0 my-1 p-1 group focus:outline-hidden transition-all active:scale-95 scroll-snap-align-center"
            >
              {/* Circular Avatar with Filled Glowing Active Ring */}
              <div
                className={`relative w-[68px] h-[68px] rounded-full p-[3.5px] transition-all duration-300 flex items-center justify-center shrink-0 ${
                  isActive
                    ? "shadow-lg shadow-red-600/40 scale-105 ring-2 ring-red-500/25"
                    : "bg-slate-200/90 border border-slate-300/40 group-hover:bg-slate-300"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, #DC2626 0%, #EA580C 50%, #F59E0B 100%)",
                      }
                    : undefined
                }
              >
                {/* Inner Image Container */}
                <div
                  style={{ position: "relative" }}
                  className="w-full h-full rounded-full overflow-hidden bg-white"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    draggable={false}
                    className={`object-cover rounded-full transition-transform duration-300 ${
                      isActive ? "scale-105" : "group-hover:scale-110"
                    }`}
                    sizes="68px"
                  />

                  {/* Subtle active warm overlay when selected */}
                  {isActive && (
                    <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
                  )}

                  {/* Corner Badge: Solid filled red circle with checkmark if active, emoji if inactive */}
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10 transition-all ${
                      isActive
                        ? "bg-red-600 text-white scale-110"
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
