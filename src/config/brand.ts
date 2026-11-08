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
  badge?: "Xit" | "Top" | "Yangi" | "Chegirma" | "-15%" | "-20%" | "Spicy";
  badgeColor?: "orange" | "red" | "green" | "yellow";
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
  brandGreeting: string;
  city: string;
  defaultAddress: string;
  deliveryTime: string;
  freeDeliveryThreshold: number; // so'm
  deliveryFee: number; // so'm
  pickupDiscountPercent: number; // Masalan: 10%
  currency: string;
  phoneNumber: string;
  telegramChannel: string;
  theme: {
    primary: string; // #FF5A1F
    primaryHover: string; // #E04B14
    primaryLight: string; // #FFF2EC
    promoDark: string; // #063F2E
    accentGreen: string; // #10B981
    accentYellow: string; // #F59E0B
    bgIvory: string; // #FBF9F5
  };
  categories: Category[];
  promoBanners: PromoBanner[];
  products: Product[];
}

export const brandConfig: BrandConfig = {
  brandName: "Chinar Fastfood",
  brandTagline: "Ishtahaochar burger, pitsa va sushi yetkazib berish",
  brandGreeting: "Xush kelibsiz, Taom Ishqibozi! 🍗",
  city: "Andijon",
  defaultAddress: "Bobur shoh ko'chasi, 15-uy, Andijon",
  deliveryTime: "30-35 daqiqa",
  freeDeliveryThreshold: 70000,
  deliveryFee: 12000,
  pickupDiscountPercent: 10,
  currency: "so'm",
  phoneNumber: "+998 90 123 45 67",
  telegramChannel: "@chinar_fastfood",
  theme: {
    primary: "#FF5A1F",
    primaryHover: "#E04B14",
    primaryLight: "#FFF4EE",
    promoDark: "#063F2E",
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
      id: "combo",
      name: "Kombo Setlar",
      icon: "🔥",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "burgers",
      name: "Burgerlar",
      icon: "🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "lavash",
      name: "Lavash & Doner",
      icon: "🌯",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "pizza",
      name: "Pitsalar",
      icon: "🍕",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "sushi",
      name: "Sushi & Rollar",
      icon: "🍣",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "snacks",
      name: "Sneki va Fri",
      icon: "🍟",
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=300&auto=format&fit=crop&q=80",
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
      tag: "⚡ TEZKOR DASTAVKA",
      title: "Buyurtmangiz 35 daqiqada issiq holda yetib boradi!",
      subtitle: "70 000 so'mdan ortiq buyurtmalar uchun yetkazib berish bepul.",
      ctaText: "Hoziroq buyurtma berish",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      bgColor: "from-[#083325] via-[#0b4835] to-[#06241a]",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
      categoryId: "combo",
    },
    {
      id: "banner-2",
      tag: "🔥 AKSIYA 30% GACHA",
      title: "Kombo & Pitsa setlariga maxsus chegirmalar!",
      subtitle: "Do'stlar va oila davrasi uchun eng manfaatli to'plamlar.",
      ctaText: "Menyuni ko'rish",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
      bgColor: "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
      badgeBg: "bg-rose-500/20 text-rose-300 border border-rose-400/30",
      categoryId: "pizza",
    },
  ],
  products: [
    {
      id: "prod-1",
      name: "Double Cheese Burger",
      description: "2x shira bosgan mol go'shti kotleti, erigan cheddar, maxsus sous va aysberg",
      price: 45000,
      oldPrice: 52000,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      categoryId: "burgers",
      rating: 4.9,
      reviewCount: "1.4k",
      badge: "Xit",
      badgeColor: "red",
      sizes: [
        { id: "std", name: "Standart", extraPrice: 0 },
        { id: "big", name: "Katta (+1 Kotlet)", extraPrice: 12000 },
        { id: "xxl", name: "XXL Mega Porsiya", extraPrice: 20000 },
      ],
      addons: [
        { id: "cheese", name: "Qo'shimcha Cheddar pishloq", price: 6000 },
        { id: "jalapeno", name: "Achchiq Xalapenyo qalampiri", price: 4000 },
        { id: "sauce", name: "Maxsus sirli sous", price: 5000 },
        { id: "bacon", name: "Qovurilgan mol beconi", price: 9000 },
      ],
    },
    {
      id: "prod-2",
      name: "Qirollik Lavashi (Big King)",
      description: "Yumshoq xamir, marinadlangan tandir go'shti, pishloq, chips, bodring va sarimsoqli sous",
      price: 38000,
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
      categoryId: "lavash",
      rating: 4.8,
      reviewCount: "980",
      badge: "Top",
      badgeColor: "yellow",
      sizes: [
        { id: "std", name: "Standart (Mini)", extraPrice: 0 },
        { id: "big", name: "Katta (Standart)", extraPrice: 6000 },
        { id: "xxl", name: "Qirollik XXL", extraPrice: 12000 },
      ],
      addons: [
        { id: "cheese", name: "Erigan Mozzarella", price: 6000 },
        { id: "jalapeno", name: "Achchiq Xalapenyo", price: 4000 },
        { id: "meat", name: "Qo'shimcha tandir go'shti", price: 12000 },
      ],
    },
    {
      id: "prod-3",
      name: "Pepperoni Pitsa (35 sm)",
      description: "Halol achchiq pepperoni kolbasalari, mo'l mozzarella, xushbo'y pomidor sousi va oregano",
      price: 68000,
      oldPrice: 80000,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
      categoryId: "pizza",
      rating: 4.9,
      reviewCount: "2.1k",
      badge: "-15%",
      badgeColor: "red",
      isSpicy: true,
      sizes: [
        { id: "std", name: "Standart (30 sm)", extraPrice: 0 },
        { id: "big", name: "Katta (35 sm)", extraPrice: 15000 },
        { id: "xxl", name: "Oila davrasi (40 sm)", extraPrice: 28000 },
      ],
      addons: [
        { id: "cheese_crust", name: "Pishloqli xamir cheti (Bortik)", price: 12000 },
        { id: "extra_cheese", name: "Qo'shimcha Mozzarella", price: 8000 },
        { id: "mushrooms", name: "Shampinyon qo'ziqorini", price: 6000 },
      ],
    },
    {
      id: "prod-4",
      name: "Filadelfiya Classic Sushi Set",
      description: "Yangi losos balig'i, yumshoq cream cheese Filadelfiya, bodring va yapon guruchi (8 dona)",
      price: 75000,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
      categoryId: "sushi",
      rating: 5.0,
      reviewCount: "860",
      badge: "Top",
      badgeColor: "yellow",
      sizes: [
        { id: "std", name: "8 dona", extraPrice: 0 },
        { id: "big", name: "12 dona (+4 dona)", extraPrice: 32000 },
        { id: "xxl", name: "16 dona Super Set", extraPrice: 60000 },
      ],
      addons: [
        { id: "ginger", name: "Zanjabil va Vasabi qo'shimcha", price: 5000 },
        { id: "unagi", name: "Unagi sousi va kunjut", price: 6000 },
      ],
    },
    {
      id: "prod-5",
      name: "Mega Zinger Kombo №1",
      description: "Qarsildoq Zinger burger, katta porsiya oltin fri, muzdek Coca-Cola 0.5L va pishloqli sous",
      price: 55000,
      oldPrice: 65000,
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
      categoryId: "combo",
      rating: 4.9,
      reviewCount: "3.5k",
      badge: "Xit",
      badgeColor: "orange",
      sizes: [
        { id: "std", name: "Standart Kombo", extraPrice: 0 },
        { id: "big", name: "Katta Kombo (+Fri & Ichimlik 1L)", extraPrice: 10000 },
      ],
      addons: [
        { id: "cheese", name: "Pishloqli sous 2 dona", price: 7000 },
        { id: "strips", name: "2 dona krispi strips", price: 11000 },
      ],
    },
    {
      id: "prod-6",
      name: "Crispy Chicken Strips (6 dona)",
      description: "Oltin rang qarsildoq tovuq filesi bo'laklari, o'tkir ziravorlar va sarimsoqli sous",
      price: 32000,
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
      categoryId: "snacks",
      rating: 4.7,
      reviewCount: "640",
      badge: "Yangi",
      badgeColor: "green",
      sizes: [
        { id: "std", name: "6 dona", extraPrice: 0 },
        { id: "big", name: "9 dona", extraPrice: 12000 },
        { id: "xxl", name: "15 dona Party Bucket", extraPrice: 34000 },
      ],
      addons: [
        { id: "bbq", name: "Barbekyu sousi", price: 5000 },
        { id: "cheese_sauce", name: "Pishloqli sous", price: 5000 },
      ],
    },
    {
      id: "prod-7",
      name: "Pishloqli Pitsa 4 Fasl (32 sm)",
      description: "Mozzarella, Parmezan, Dorblu va Gauda pishloqlari, qaymoqli sous va italyan rayhoni",
      price: 64000,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      categoryId: "pizza",
      rating: 4.8,
      reviewCount: "1.1k",
      sizes: [
        { id: "std", name: "30 sm", extraPrice: 0 },
        { id: "big", name: "35 sm", extraPrice: 14000 },
      ],
      addons: [
        { id: "cheese_crust", name: "Pishloqli bortik", price: 12000 },
        { id: "olives", name: "Qora zaytunlar", price: 5000 },
      ],
    },
    {
      id: "prod-8",
      name: "Klassik Tandir Doner Kebab",
      description: "Qarsildoq non ichida xushbo'y tandir mol go'shti, yangi pomidor, qizil piyoz va maxsus sous",
      price: 34000,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      categoryId: "lavash",
      rating: 4.7,
      reviewCount: "820",
      sizes: [
        { id: "std", name: "Standart doner", extraPrice: 0 },
        { id: "big", name: "Katta porsiya", extraPrice: 7000 },
      ],
      addons: [
        { id: "cheese", name: "Pishloq qo'shish", price: 5000 },
        { id: "jalapeno", name: "Achchiq qalampir", price: 4000 },
      ],
    },
    {
      id: "prod-9",
      name: "Kaliforniya Roll Set (8 dona)",
      description: "Qisqichbaqa go'shti, pishgan avokado, bodring, yapon mayonezi va mayda uchuvchi baliq ikrasi (Tobiko)",
      price: 58000,
      image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&auto=format&fit=crop&q=80",
      categoryId: "sushi",
      rating: 4.8,
      reviewCount: "540",
      sizes: [
        { id: "std", name: "8 dona", extraPrice: 0 },
        { id: "big", name: "16 dona (2x set)", extraPrice: 48000 },
      ],
      addons: [
        { id: "soya", name: "Qo'shimcha soya sousi", price: 4000 },
        { id: "chilli", name: "Spicy achchiq sous", price: 5000 },
      ],
    },
    {
      id: "prod-10",
      name: "Oltin Kartoshka Fri (Katta)",
      description: "Tashqarisi qarsildoq, ichi yumshoq oltinrang kartoshka somonchalari va dengiz tuzi",
      price: 18000,
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
      categoryId: "snacks",
      rating: 4.9,
      reviewCount: "2.8k",
      badge: "Xit",
      badgeColor: "yellow",
      sizes: [
        { id: "std", name: "O'rtacha porsiya", extraPrice: 0 },
        { id: "big", name: "Katta porsiya", extraPrice: 5000 },
      ],
      addons: [
        { id: "ketchup", name: "Ketchup", price: 3000 },
        { id: "cheese_dip", name: "Pishloqli dip sous", price: 5000 },
      ],
    },
    {
      id: "prod-11",
      name: "Hot Spicy Wings (8 dona)",
      description: "O'tkir marinadli, xushbo'y qizargan qanotlar — haqiqiy achchiq sevuvchilar uchun",
      price: 42000,
      image: "https://images.unsplash.com/photo-1527477378696-2a62372ba007?w=600&auto=format&fit=crop&q=80",
      categoryId: "snacks",
      rating: 4.8,
      reviewCount: "1.3k",
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
      id: "prod-12",
      name: "Muzdek Coca-Cola (0.5L)",
      description: "Original gazlangan tetiklashtiruvchi klassik ichimlik, muzdek haroratda",
      price: 8000,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      categoryId: "drinks",
      rating: 5.0,
      reviewCount: "4.2k",
      sizes: [
        { id: "std", name: "0.5 L", extraPrice: 0 },
        { id: "big", name: "1.0 L", extraPrice: 5000 },
        { id: "xxl", name: "1.5 L", extraPrice: 9000 },
      ],
    },
  ],
};
