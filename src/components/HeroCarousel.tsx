"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { useTelegram } from "@/hooks/useTelegram";

interface HeroCarouselProps {
  onSelectCategory?: (categoryId: string) => void;
  onCtaClick?: () => void;
}

export function HeroCarousel({ onSelectCategory, onCtaClick }: HeroCarouselProps) {
  const { triggerHaptic } = useTelegram();
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = brandConfig.promoBanners;

  // Auto advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const banner = banners[currentSlide] || banners[0];

  const handleCta = () => {
    triggerHaptic("medium");
    if (banner.categoryId && onSelectCategory) {
      onSelectCategory(banner.categoryId);
    }
    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <div className="px-4 py-2">
      <div
        className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${banner.bgColor} text-white shadow-xl shadow-orange-950/10 min-h-[180px] p-5 flex flex-col justify-between transition-all duration-500`}
      >
        {/* Subtle decorative background ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-[62%]">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md mb-2 shadow-xs bg-white/10 text-orange-200 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{banner.tag}</span>
          </div>

          {/* Heading */}
          <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-xs line-clamp-2">
            {banner.title}
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] text-slate-200/90 font-medium mt-1 line-clamp-2">
            {banner.subtitle}
          </p>

          {/* CTA Button */}
          <button
            onClick={handleCta}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 active:scale-95 transition-all group"
          >
            <span>{banner.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Floating food image on the right */}
        <div className="absolute right-0 bottom-0 top-0 w-2/5 flex items-center justify-center p-2 pointer-events-none">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 transform translate-x-2 translate-y-1">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover scale-105"
              sizes="(max-width: 768px) 160px, 200px"
              priority
            />
          </div>
        </div>

        {/* Carousel Indicators / Dots */}
        {banners.length > 1 && (
          <div className="relative z-10 flex items-center gap-1.5 mt-2 self-start">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic("light");
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-5 bg-white shadow-xs"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
