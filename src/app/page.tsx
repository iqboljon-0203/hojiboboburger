"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import { brandConfig, Product } from "@/config/brand";
import { CartProvider, useCart, PlacedOrder } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { SearchBar, FilterType } from "@/components/SearchBar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryList } from "@/components/CategoryList";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { AddressModal } from "@/components/AddressModal";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { BottomNavigation, NavTab } from "@/components/BottomNavigation";
import { FavoritesView } from "@/components/FavoritesView";
import { ProfileView } from "@/components/ProfileView";
import { MenuView } from "@/components/MenuView";
import { ActiveOrderTracker } from "@/components/ActiveOrderTracker";
import { useTelegram } from "@/hooks/useTelegram";

function MainContent() {
  const { orders } = useCart();
  const { showBackButton, hideBackButton } = useTelegram();

  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Modals state
  const [activeProductForModal, setActiveProductForModal] = useState<Product | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);

  // Manage native Telegram BackButton
  React.useEffect(() => {
    const hasOpenModal =
      Boolean(activeProductForModal) ||
      isAddressModalOpen ||
      isCartOpen ||
      Boolean(lastPlacedOrder) ||
      currentTab !== "home";

    if (hasOpenModal) {
      showBackButton(() => {
        if (activeProductForModal) {
          setActiveProductForModal(null);
        } else if (isAddressModalOpen) {
          setIsAddressModalOpen(false);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        } else if (lastPlacedOrder) {
          setLastPlacedOrder(null);
        } else if (currentTab !== "home") {
          setCurrentTab("home");
        }
      });
    } else {
      hideBackButton();
    }
  }, [
    activeProductForModal,
    isAddressModalOpen,
    isCartOpen,
    lastPlacedOrder,
    currentTab,
    showBackButton,
    hideBackButton,
  ]);

  // Filtered products logic for Home tab
  const filteredProducts = brandConfig.products.filter((p) => {
    if (selectedCategoryId !== "all" && p.categoryId !== selectedCategoryId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (selectedFilter === "spicy" && !p.isSpicy) return false;
    if (selectedFilter === "popular" && p.badge !== "Xit" && p.badge !== "Top") return false;
    if (selectedFilter === "new" && p.badge !== "Yangi") return false;
    if (selectedFilter === "discount" && !p.oldPrice && !p.badge?.includes("%")) return false;

    return true;
  });

  // Popular / Featured list (first 6 items)
  const popularCombos = filteredProducts.slice(0, 6);
  // Secondary list (remaining items or special section)
  const specialOffers = filteredProducts.slice(6);

  const handleOpenProduct = (product: Product) => {
    setActiveProductForModal(product);
  };

  const handleSelectCategoryFromBanner = (catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentTab("menu");
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#FBF9F5] shadow-2xl relative flex flex-col pb-24 overflow-x-hidden">
      {/* 1. Header with Address bar */}
      <Header
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* 2. Main Tab View Router */}
      {currentTab === "home" && (
        <main className="space-y-2">
          {/* Search bar & filter pills */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* Active Order Live Tracker */}
          {orders.length > 0 && (
            <ActiveOrderTracker
              order={orders[0]}
              onOpenDetails={(ord) => setLastPlacedOrder(ord)}
            />
          )}

          {/* Hero Promo Carousel (Matches KFC reference style) */}
          <HeroCarousel
            onSelectCategory={handleSelectCategoryFromBanner}
            onCtaClick={() => setSelectedCategoryId("combo")}
          />

          {/* Categories Horizontal Carousel */}
          <CategoryList
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Section: Popular Combos */}
          <div className="px-4 pt-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-black text-slate-800 tracking-tight">
                  {selectedCategoryId === "all"
                    ? "Ommabop Taomlar"
                    : brandConfig.categories.find((c) => c.id === selectedCategoryId)?.name}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Mijozlarimiz tomonidan eng ko&apos;p buyurtma qilinganlar
                </p>
              </div>

              <button
                onClick={() => setCurrentTab("menu")}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group py-1"
              >
                <span>Barchasi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 2-Column Product Grid */}
            {popularCombos.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 my-4">
                <p className="text-xs text-slate-400">
                  Mos keluvchi taomlar topilmadi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {popularCombos.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenProduct}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Secondary Promotional Banner (Like KFC 30% OFF banner in reference) */}
          <div className="px-4 py-2 mt-2">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-50 to-orange-100 border border-orange-200/60 p-4 flex items-center justify-between shadow-xs">
              <div className="max-w-[62%]">
                <span className="text-[10px] font-extrabold uppercase text-orange-600 tracking-wider block">
                  MAXSUS TAKLIF
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-snug mt-0.5">
                  Kombo va Pitsalarga 30% gacha tejab qoling!
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategoryId("combo");
                    setCurrentTab("menu");
                  }}
                  className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
                >
                  <span>Hoziroq olish</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* 30% OFF Circle Badge */}
              <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex flex-col items-center justify-center shadow-lg shadow-orange-600/30 ring-4 ring-white shrink-0">
                <span className="text-sm font-black leading-none">30%</span>
                <span className="text-[9px] font-bold uppercase tracking-tight">OFF</span>
              </div>
            </div>
          </div>

          {/* Secondary Products Section */}
          {specialOffers.length > 0 && (
            <div className="px-4 pt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Tavsiya etilgan lazzatlar</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {specialOffers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* 3. Menu Tab View */}
      {currentTab === "menu" && (
        <MenuView
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          searchQuery={searchQuery}
          selectedFilter={selectedFilter}
          onOpenDetails={handleOpenProduct}
        />
      )}

      {/* 4. Favorites Tab View */}
      {currentTab === "favorites" && (
        <FavoritesView
          onOpenDetails={handleOpenProduct}
          onExploreMenu={() => setCurrentTab("menu")}
        />
      )}

      {/* 5. Profile Tab View */}
      {currentTab === "profile" && (
        <ProfileView
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          onExploreMenu={() => setCurrentTab("menu")}
        />
      )}

      {/* 6. Product Detail Bottom Sheet */}
      <ProductDetailModal
        product={activeProductForModal}
        onClose={() => setActiveProductForModal(null)}
      />

      {/* 7. Address Picker Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      {/* 8. Checkout Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOrderSuccess={(order) => setLastPlacedOrder(order)}
      />

      {/* 9. Order Success Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={() => setLastPlacedOrder(null)}
      />

      {/* 10. Fixed Bottom Navigation Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
