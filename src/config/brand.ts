export interface BrandSizeOption {
  id: string;
  name: string;
  extraPrice: number;
}

export interface BrandAddonOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  categoryId: string;
  rating: number;
  reviewCount: string;
  badge?: "Xit" | "Top" | "Yangi" | "Chegirma" | "-15%" | "-20%" | "Spicy" | "Josper Grill";
  badgeColor?: "orange" | "red" | "green" | "yellow" | "charcoal";
  isSpicy?: boolean;
  sizes?: BrandSizeOption[];
  addons?: BrandAddonOption[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  bgColor: string;
  badgeBg: string;
  categoryId?: string;
}

export interface BrandConfig {
  brandName: string;
  brandTagline: string;
  brandSubName: string;
  brandGreeting: string;
  brandStory: string;
  city: string;
  defaultAddress: string;
  deliveryTime: string;
  freeDeliveryThreshold: number; // so'm
  deliveryFee: number; // so'm
  pickupDiscountPercent: number; // Masalan: 10%
  currency: string;
  phoneNumber: string;
  instagram: string;
  telegramChannel: string;
  logoUrl: string;
  theme: {
    primary: string; // #E11D48 or #DC2626 (HojiBobo grill flame red)
    primaryHover: string;
    primaryLight: string;
    charcoal: string;
    promoDark: string;
    accentGreen: string;
    accentYellow: string;
    bgIvory: string;
  };
  categories: Category[];
  promoBanners: PromoBanner[];
  products: Product[];
}

export const brandConfig: BrandConfig = {
  brandName: "HojiBobo Burger",
  brandSubName: "EST. 2017 | KOREA",
  brandTagline: "Hosper (Josper) grillda pishiriladigan ASL burger va kaboblar",
  brandGreeting: "Xush kelibsiz, HojiBobo mehmoni! 🔥",
  brandStory: "Bizning brend 2017 yilda Janubiy Koreyada asos solingan. Hosper (Josper) pechida haqiqiy ko'mir taftida pishiriladigan ASL burgerlar va kaboblar.",
  city: "Toshkent",
  defaultAddress: "Toshkent shahri, Chilonzor tumani (HojiBobo Burger)",
  deliveryTime: "30-35 daqiqa",
  freeDeliveryThreshold: 75000,
  deliveryFee: 14000,
  pickupDiscountPercent: 10,
  currency: "so'm",
  phoneNumber: "+998 90 999 77 77",
  instagram: "@hojibobo_burger.uz",
  telegramChannel: "@hojibobo_burger",
  logoUrl: "/images/hojibobo-logo.svg",
  theme: {
    primary: "#DC2626", // Flame red matching HojiBobo logo
    primaryHover: "#B91C1C",
    primaryLight: "#FEF2F2",
    charcoal: "#18181B",
    promoDark: "#171717",
    accentGreen: "#10B981",
    accentYellow: "#F59E0B",
    bgIvory: "#FBF9F5",
  },
  categories: [
    {
      id: "all",
      name: "Barchasi",
      icon: "✨",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "burgers",
      name: "Hosper Burgerlar",
      icon: "🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "kebab",
      name: "Adana & Kofte Kebab",
      icon: "🥩",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "combo",
      name: "Hosper Kombolar",
      icon: "🔥",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "lavash",
      name: "Grill Lavash & Doner",
      icon: "🌯",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "snacks",
      name: "Sneki va Fri",
      icon: "🍟",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "drinks",
      name: "Ichimliklar",
      icon: "🥤",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&auto=format&fit=crop&q=80",
    },
  ],
  promoBanners: [
    {
      id: "banner-1",
      tag: "🔥 JOSPER CHARCOAL GRILL",
      title: "Haqiqiy ko'mir taftida pishirilgan ASL burgerlar!",
      subtitle: "2017 yilda Koreyada asos solingan HojiBobo brendidan shira bosgan taomlar.",
      ctaText: "Hoziroq tatib ko'rish",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      bgColor: "from-[#1c1917] via-[#292524] to-[#0c0a09]",
      badgeBg: "bg-red-500/20 text-red-300 border border-red-400/30",
      categoryId: "burgers",
    },
    {
      id: "banner-2",
      tag: "⚡ ADANA VA KOFTE KEBAB",
      title: "Sharqona lazzat: Hosper Adana va Kofte taomlari!",
      subtitle: "75 000 so'mdan ortiq buyurtmalar uchun Toshkent bo'ylab bepul yetkazib berish.",
      ctaText: "Kebablar menyusi",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      bgColor: "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
      badgeBg: "bg-amber-500/20 text-amber-300 border border-amber-400/30",
      categoryId: "kebab",
    },
  ],
  products: [
    {
      id: "prod-hb-1",
      name: "HojiBobo Special Josper Burger",
      description: "Josper ko'mir pechida dudlangan 100% asl mol go'shti kotleti, erigan cheddar, karamel piyoz va sirli sous",
      price: 52000,
      oldPrice: 58000,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      categoryId: "burgers",
      rating: 4.9,
      reviewCount: "2.8k",
      badge: "Xit",
      badgeColor: "red",
      sizes: [
        { id: "std", name: "Standart (180g kotlet)", extraPrice: 0 },
        { id: "big", name: "Katta (+Qo'shimcha kotlet)", extraPrice: 16000 },
        { id: "xxl", name: "Mega HojiBobo (3x kotlet)", extraPrice: 28000 },
      ],
      addons: [
        { id: "cheddar", name: "Dudlangan Cheddar pishloq", price: 6000 },
        { id: "jalapeno", name: "O'tkir Xalapenyo qalampir", price: 4000 },
        { id: "special_sauce", name: "HojiBobo Josper maxsus sous", price: 5000 },
        { id: "bacon", name: "Mol go'shti beconi", price: 10000 },
      ],
    },
    {
      id: "prod-hb-2",
      name: "Adana Kebab Dürüm (Hosper Grill)",
      description: "Hosper grillda xushbo'y ko'mir taftida pishirilgan achchiq Adana go'shti, pishirilgan pomidor va sumaxli qizil piyoz",
      price: 46000,
      oldPrice: 52000,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      categoryId: "kebab",
      rating: 5.0,
      reviewCount: "1.9k",
      badge: "Top",
      badgeColor: "yellow",
      isSpicy: true,
      sizes: [
        { id: "std", name: "Standart porsiya", extraPrice: 0 },
        { id: "big", name: "Katta Adana (1.5x go'sht)", extraPrice: 15000 },
      ],
      addons: [
        { id: "cheese", name: "Erigan pishloq", price: 6000 },
        { id: "sauce", name: "Achchiq turkcha sous", price: 4000 },
        { id: "meat", name: "Qo'shimcha Adana go'shti", price: 16000 },
      ],
    },
    {
      id: "prod-hb-3",
      name: "Turkcha Kofte Kebab Set",
      description: "Hosper olovida pishirilgan yumshoq turkcha kofte kotletlari, yangi lavash, oltin fri va maxsus ajika",
      price: 48000,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      categoryId: "kebab",
      rating: 4.8,
      reviewCount: "1.4k",
      badge: "Josper Grill",
      badgeColor: "charcoal",
      sizes: [
        { id: "std", name: "4 dona Kofte Set", extraPrice: 0 },
        { id: "big", name: "6 dona Kofte Set", extraPrice: 14000 },
      ],
      addons: [
        { id: "fries", name: "Qo'shimcha fri", price: 6000 },
        { id: "ayron", name: "Muzdek Ayron 0.3L", price: 7000 },
      ],
    },
    {
      id: "prod-hb-4",
      name: "Double Cheese Josper Burger",
      description: "2x mol go'shti kotleti, 2x erigan shira cheddar, tutunli barbekyu sousi, aysberg va yangi pomidor",
      price: 68000,
      oldPrice: 76000,
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
      categoryId: "burgers",
      rating: 4.9,
      reviewCount: "3.2k",
      badge: "Xit",
      badgeColor: "red",
      sizes: [
        { id: "std", name: "Double (2x kotlet)", extraPrice: 0 },
        { id: "big", name: "Triple (3x kotlet Monster)", extraPrice: 20000 },
      ],
      addons: [
        { id: "cheese", name: "Qo'shimcha Cheddar", price: 6000 },
        { id: "jalapeno", name: "Achchiq qalampir", price: 4000 },
      ],
    },
    {
      id: "prod-hb-5",
      name: "HojiBobo Kombo №1 (Mega Josper)",
      description: "HojiBobo Special burger, katta porsiya oltin fri, Coca-Cola 0.5L va pishloqli dip sous",
      price: 65000,
      oldPrice: 75000,
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
      categoryId: "combo",
      rating: 5.0,
      reviewCount: "4.1k",
      badge: "-15%",
      badgeColor: "red",
      sizes: [
        { id: "std", name: "Standart Kombo", extraPrice: 0 },
        { id: "big", name: "Katta Kombo (+Fri & Ichimlik 1L)", extraPrice: 12000 },
      ],
      addons: [
        { id: "wings", name: "2 dona dudlangan qanot", price: 11000 },
        { id: "cheese_sauce", name: "Pishloqli sous 2 dona", price: 7000 },
      ],
    },
    {
      id: "prod-hb-6",
      name: "Josper Crispy Chicken Burger",
      description: "Grillda qizartirilgan shirali tovuq filesi, erigan pishloq, yangi pomidor va sarimsoqli krem sous",
      price: 39000,
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
      categoryId: "burgers",
      rating: 4.8,
      reviewCount: "1.1k",
      sizes: [
        { id: "std", name: "Standart burger", extraPrice: 0 },
        { id: "big", name: "Double Chicken (+1 file)", extraPrice: 12000 },
      ],
      addons: [
        { id: "cheese", name: "Pishloq", price: 5000 },
        { id: "spicy", name: "Achchiq sous", price: 4000 },
      ],
    },
    {
      id: "prod-hb-7",
      name: "HojiBobo Grill Lavash (Big)",
      description: "Josperda dudlangan lazzatli tandir go'shti, qarsildoq chips, erigan pishloq, bodring va mualliflik sousi",
      price: 38000,
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
      categoryId: "lavash",
      rating: 4.8,
      reviewCount: "1.6k",
      badge: "Top",
      badgeColor: "yellow",
      sizes: [
        { id: "std", name: "Standart", extraPrice: 0 },
        { id: "big", name: "Katta Lavash", extraPrice: 7000 },
        { id: "xxl", name: "Qirollik XXL", extraPrice: 14000 },
      ],
      addons: [
        { id: "cheese", name: "Erigan Mozzarella", price: 6000 },
        { id: "meat", name: "Qo'shimcha go'sht", price: 12000 },
      ],
    },
    {
      id: "prod-hb-8",
      name: "Adana Kebab Kombo Set",
      description: "Adana kebab dürümi, oltin krispi fri, muzdek Ayron yoki Coca-Cola va sous",
      price: 59000,
      oldPrice: 68000,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      categoryId: "combo",
      rating: 4.9,
      reviewCount: "2.1k",
      isSpicy: true,
      badge: "Yangi",
      badgeColor: "green",
      sizes: [
        { id: "std", name: "Standart Set", extraPrice: 0 },
        { id: "big", name: "Mega Set", extraPrice: 12000 },
      ],
      addons: [
        { id: "cheese", name: "Pishloq qo'shish", price: 5000 },
      ],
    },
    {
      id: "prod-hb-9",
      name: "Dudlangan Hot Wings (8 dona)",
      description: "Josper olovida dudlangan, o'tkir marinadli qarsildoq tovuq qanotchalari",
      price: 44000,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
      categoryId: "snacks",
      rating: 4.8,
      reviewCount: "940",
      badge: "Spicy",
      badgeColor: "red",
      isSpicy: true,
      sizes: [
        { id: "std", name: "8 dona", extraPrice: 0 },
        { id: "big", name: "12 dona", extraPrice: 18000 },
      ],
      addons: [
        { id: "ranch", name: "Ranch sovutuvchi sous", price: 5000 },
      ],
    },
    {
      id: "prod-hb-10",
      name: "Oltin Fri (Hosper Ziravorlari bilan)",
      description: "Qarsildoq oltin fri somonchalari, tutunli dengiz tuzi va tomat dip",
      price: 18000,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
      categoryId: "snacks",
      rating: 4.9,
      reviewCount: "3.5k",
      badge: "Xit",
      badgeColor: "yellow",
      sizes: [
        { id: "std", name: "O'rtacha porsiya", extraPrice: 0 },
        { id: "big", name: "Katta porsiya", extraPrice: 5000 },
      ],
      addons: [
        { id: "cheese_dip", name: "Pishloqli dip", price: 5000 },
        { id: "ketchup", name: "Maxsus ketchup", price: 3000 },
      ],
    },
    {
      id: "prod-hb-11",
      name: "Muzdek Milliy Ayron (0.5L)",
      description: "Kebab va burgerlar bilan ajoyib uyg'unlashadigan tetiklashtiruvchi yaxna ichimlik",
      price: 9000,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      categoryId: "drinks",
      rating: 5.0,
      reviewCount: "1.2k",
      sizes: [
        { id: "std", name: "0.5 L", extraPrice: 0 },
        { id: "big", name: "1.0 L", extraPrice: 6000 },
      ],
    },
    {
      id: "prod-hb-12",
      name: "Coca-Cola Original (0.5L)",
      description: "Original gazlangan tetiklashtiruvchi klassik muzdek ichimlik",
      price: 8000,
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80",
      categoryId: "drinks",
      rating: 5.0,
      reviewCount: "4.8k",
      sizes: [
        { id: "std", name: "0.5 L", extraPrice: 0 },
        { id: "big", name: "1.0 L", extraPrice: 5000 },
        { id: "xxl", name: "1.5 L", extraPrice: 9000 },
      ],
    },
  ],
};
