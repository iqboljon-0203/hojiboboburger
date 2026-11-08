"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, MapPin, ChefHat, Bike, Flame, Check } from "lucide-react";
import { HojiBoboLogo } from "@/components/HojiBoboLogo";
import { brandConfig } from "@/config/brand";
import { useTelegram } from "@/hooks/useTelegram";

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function OnboardingFlow({ isOpen, onComplete }: OnboardingFlowProps) {
  const { triggerHaptic } = useTelegram();
  const [stage, setStage] = useState<"splash" | "onboarding">("splash");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Splash auto-transition after 1.8 seconds
  useEffect(() => {
    if (!isOpen) return;
    if (stage === "splash") {
      const timer = setTimeout(() => {
        setStage("onboarding");
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const slides = [
    {
      id: "slide-1",
      tag: "ENG SARA LAZZATLAR",
      title: "Sevimli taomingizni tanlang!",
      subtitle:
        "Josper ko'mir pechida pishirilgan shirali burgerlar, xushbo'y Adana va Kofte kebablar sizni kutmoqda.",
      image: "/images/onboarding-food.jpg",
      fallbackIcon: <ChefHat className="w-16 h-16 text-amber-400" />,
      accentColor: "from-red-600 to-amber-600",
    },
    {
      id: "slide-2",
      tag: "MAXSUS TAKLIFLAR",
      title: "35 daqiqada qaynoq yetkazish!",
      subtitle:
        "75 000 so'mdan yuqori har qanday buyurtma Toshkent shahri bo'ylab mutlaqo bepul yetkazib beriladi.",
      image: "/images/onboarding-courier.jpg",
      fallbackIcon: <Bike className="w-16 h-16 text-red-500" />,
      accentColor: "from-stone-900 to-red-900",
    },
    {
      id: "slide-3",
      tag: "JONLI HARAKAT",
      title: "Buyurtmangizni real vaqtda kuzating!",
      subtitle:
        "Oshxonada tayyorlanishidan to eshigingizgacha kuryer harakatini qadamma-qadam kuzatib boring.",
      image: "/images/onboarding-map.jpg",
      fallbackIcon: <MapPin className="w-16 h-16 text-emerald-400" />,
      accentColor: "from-amber-600 to-red-700",
    },
  ];

  const handleNext = () => {
    triggerHaptic("light");
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    triggerHaptic("medium");
    try {
      localStorage.setItem("hojibobo_onboarded", "true");
    } catch (e) {
      // Ignored
    }
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Container constrained to mobile screen */}
      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-[#FBF9F5] overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* STAGE 1: Splash Screen */}
        {stage === "splash" ? (
          <div
            onClick={() => setStage("onboarding")}
            className="w-full h-full bg-[#18181B] text-white flex flex-col items-center justify-between p-8 py-14 cursor-pointer select-none animate-in fade-in duration-300"
          >
            {/* Top subtle decorative */}
            <div className="w-12 h-1 bg-white/20 rounded-full" />

            {/* Central Animated Badge & Fire */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-xl animate-pulse" />
                <div className="relative p-2 rounded-full ring-4 ring-red-600/30 shadow-2xl shadow-red-950">
                  <HojiBoboLogo size={140} />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Josper Charcoal Grill</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md">
                HOJI<span className="text-red-500">BOBO</span> BURGER
              </h1>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
                EST. 2017 | JANUBIY KOREYA
              </p>
            </div>

            {/* Bottom loader */}
            <div className="w-full max-w-[200px] flex flex-col items-center gap-2">
              <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-linear-to-r from-red-600 to-amber-500 rounded-full animate-in slide-in-from-left duration-1000" />
              </div>
              <span className="text-[10px] text-stone-500 font-semibold tracking-wider">
                Yuklanmoqda...
              </span>
            </div>
          </div>
        ) : (
          /* STAGE 2: Onboarding 3-step Carousel */
          <div className="w-full h-full flex flex-col justify-between p-6 py-8 animate-in fade-in duration-300">
            {/* Top Bar with Skip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HojiBoboLogo size={32} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  HOJIBOBO
                </span>
              </div>

              <button
                onClick={handleFinish}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                O&apos;tkazib yuborish
              </button>
            </div>

            {/* Center Visual & Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
              {/* Illustration container */}
              <div
                style={{ position: "relative" }}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-linear-to-b from-stone-900 to-stone-950 p-4 flex items-center justify-center shadow-xl shadow-stone-950/10 mb-6 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-radial from-red-600/20 via-transparent to-transparent pointer-events-none" />

                {/* Main image or fallback illustration */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 280px, 320px"
                  onError={(e) => {
                    // Fallback to icon if file is still loading
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center ring-2 ring-white/10 shadow-inner">
                    {slide.fallbackIcon}
                  </div>
                </div>
              </div>

              {/* Tag badge */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-red-600" />
                <span>{slide.tag}</span>
              </span>

              {/* Title & Subtitle */}
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight max-w-[280px]">
                {slide.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-[300px] leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Bottom Actions & Pagination Dots */}
            <div className="space-y-4 pt-2">
              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerHaptic("light");
                      setCurrentSlide(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "w-8 bg-red-600 shadow-xs"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* CTA Next / Start Button */}
              <button
                onClick={handleNext}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all group"
              >
                <span>
                  {currentSlide === slides.length - 1
                    ? "Menyuni Ko'rish va Boshlash"
                    : "Keyingisi"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
