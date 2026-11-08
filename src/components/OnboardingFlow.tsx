"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, MapPin, ChefHat, Bike, Flame, ChevronRight, X } from "lucide-react";
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

  // Splash auto-transition after 2 seconds
  useEffect(() => {
    if (!isOpen) return;
    if (stage === "splash") {
      const timer = setTimeout(() => {
        setStage("onboarding");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const slides = [
    {
      id: "slide-1",
      tag: "🔥 JOSPER CHARCOAL GRILL",
      title: "Sevimli taomingizni tanlang!",
      subtitle:
        "Hosper ko'mir pechida pishirilgan haqiqiy shira bosgan burgerlar va xushbo'y Adana kebablar sizni kutmoqda.",
      image: "/images/onboarding-food.jpg",
      bgGradient: "from-[#1F0E0E] via-[#140A0A] to-[#0A0505]",
      glowColor: "from-red-600/30 via-amber-500/10 to-transparent",
      badgeBg: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    {
      id: "slide-2",
      tag: "⚡ TEZKOR VA QAYNOQ",
      title: "35 daqiqada issiq holda yetkazish!",
      subtitle:
        "75 000 so'mdan yuqori har qanday buyurtma Toshkent shahri bo'ylab mutlaqo bepul yetkazib beriladi.",
      image: "/images/onboarding-courier.jpg",
      bgGradient: "from-[#24130A] via-[#160C06] to-[#0A0503]",
      glowColor: "from-amber-600/30 via-red-600/10 to-transparent",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "slide-3",
      tag: "📍 JONLI HARAKAT",
      title: "Buyurtmangizni real vaqtda kuzating!",
      subtitle:
        "Oshxonada tayyorlanishidan to eshigingizgacha kuryer harakatini qadamma-qadam xaritada kuzatib boring.",
      image: "/images/onboarding-map.jpg",
      bgGradient: "from-[#0E1726] via-[#090F1A] to-[#04070D]",
      glowColor: "from-emerald-600/25 via-sky-600/10 to-transparent",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
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
    <div className="fixed inset-0 z-50 w-full h-full overflow-hidden select-none animate-in fade-in duration-300">
      {/* STAGE 1: Fullscreen Splash Screen */}
      {stage === "splash" ? (
        <div
          onClick={() => setStage("onboarding")}
          className="relative w-full h-full bg-[#121214] text-white flex flex-col items-center justify-between p-6 py-12 cursor-pointer overflow-hidden"
        >
          {/* Ambient Lighting & Charcoal Embers */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Indicator */}
          <div className="w-16 h-1 bg-white/20 rounded-full z-10" />

          {/* Central Logo & Brand Identity */}
          <div className="flex flex-col items-center text-center z-10 my-auto">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-linear-to-r from-red-600 to-amber-500 rounded-full blur-2xl opacity-40 animate-pulse" />
              <div className="relative p-3 rounded-full ring-4 ring-white/10 shadow-2xl shadow-red-950/80 bg-stone-900/80 backdrop-blur-md">
                <HojiBoboLogo size={150} />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/40 text-amber-400 text-xs font-black uppercase tracking-widest mb-3 shadow-lg">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Josper Charcoal Grill</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">
              HOJI<span className="text-red-500">BOBO</span> BURGER
            </h1>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
              EST. 2017 | JANUBIY KOREYA
            </p>
          </div>

          {/* Bottom Progress loader & tap prompt */}
          <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10">
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div className="w-full h-full bg-linear-to-r from-red-600 via-amber-500 to-red-500 rounded-full animate-in slide-in-from-left duration-1500" />
            </div>
            <span className="text-[11px] text-stone-400 font-medium">
              Ekranga bosing yoki kuting...
            </span>
          </div>
        </div>
      ) : (
        /* STAGE 2: Fullscreen 3D Onboarding Carousel with Rich Background */
        <div
          className={`relative w-full h-full bg-linear-to-b ${slide.bgGradient} text-white flex flex-col justify-between overflow-hidden transition-colors duration-700`}
        >
          {/* Dynamic Ambient Background Glow */}
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-radial ${slide.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-700`}
          />

          {/* Top Navigation Bar: Brand Badge & Skip button */}
          <div className="relative z-20 flex items-center justify-between p-5 pt-8 sm:pt-6 max-w-lg mx-auto w-full">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/15 shadow-lg">
              <HojiBoboLogo size={26} />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                HOJI<span className="text-red-500">BOBO</span>
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="text-xs font-bold text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all active:scale-95"
            >
              O&apos;tkazib yuborish
            </button>
          </div>

          {/* Center: Large 3D Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-4 my-auto">
            <div
              style={{ position: "relative" }}
              className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group transition-transform duration-500"
            >
              {/* Inner ambient glow */}
              <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none z-10" />

              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 320px, 400px"
              />
            </div>
          </div>

          {/* Bottom Frosted Glass Card with Content & Actions */}
          <div className="relative z-20 w-full max-w-lg mx-auto bg-stone-900/80 backdrop-blur-2xl border-t border-white/15 rounded-t-[36px] p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl space-y-4">
            {/* Tag Badge */}
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-md ${slide.badgeBg}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center px-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-normal mt-2 leading-relaxed max-w-sm mx-auto">
                {slide.subtitle}
              </p>
            </div>

            {/* Pagination Pill Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    triggerHaptic("light");
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-red-600 shadow-md shadow-red-600/50"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Bottom Actions CTA */}
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/35 flex items-center justify-center gap-2 active:scale-[0.98] transition-all group"
              >
                <span>
                  {currentSlide === slides.length - 1
                    ? "Menyuni Ko'rish va Boshlash 🔥"
                    : "Keyingisi"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
