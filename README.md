# 🍔 Fast-Food, Pitsa va Sushi yetkazib berish xizmati uchun Telegram Mini App (TMA)

Ushbu loyiha zamonaviy **Next.js (App Router)**, **React 19**, **TypeScript** va **Tailwind CSS v4** asosida yaratilgan, to'liq mobil ekranga (`max-w-md`, 9:16) va **Telegram Mini App (WebApp)** muhitiga moslashtirilgan oq yorliq (**White-Label**) yetkazib berish ilovasi hisoblanadi.

Dizayn KFC mobil ilovasi etalon dizayni (`media_1794117832440_91c3850b.jpg`) asosida nozik did bilan ishlab chiqilgan.

---

## 🚀 1. Asosiy Xususiyatlar va Imkoniyatlar

1. **10 Daqiqalik White-Label Arxitektura (`src/config/brand.ts`):**
   - Istalgan boshqa restoran yoki kafelarga demo ko'rsatish uchun faqat bitta `src/config/brand.ts` faylini o'zgartirish kifoya:
     - `brandName`, `brandTagline`, `city`, `defaultAddress`
     - `deliveryTime`, `freeDeliveryThreshold` (70 000 so'm), `deliveryFee`
     - `theme` ranglar palitrasi
     - Kategoriyalar, mahsulotlar, porsiya va qo'shimchalar (addons) narxlari.

2. **Dizayn va Foydalanuvchi Interfeysi (UI/UX):**
   - **Header & GPS Manzil:** Brend logotipi, qo'ng'iroqcha bildirishnomalari va GPS orqali manzilni aniqlash modal oynasi.
   - **Qidiruv & Filtrlar:** Haqiqiy vaqtda tezkor qidiruv hamda `🔥 Xit`, `🌶️ Achchiq`, `🆕 Yangi`, `🏷️ Chegirmada` filtrlari.
   - **Hero Carousel Banner:** To'q yashil/qizil gradientda ishtahaochar 35 daqiqalik tezkor yetkazib berish promo banneri va CTA tugmasi.
   - **Dumaloq Kategoriyalar:** Gorizontal skroll, aktiv kategoriya uchun qizil/to'q sariq hoshiyali animatsiya.
   - **2 Ustunli Taomlar Katalogi:** `aspect-square` yuqori sifatli fotosuratlar, `★ Top` / `🔥 Xit` badjlari, sevimlilar (yurakcha), reyting `⭐ 4.9 (1.4k)` va tezkor savatga qo'shish tugmasi (`- 1 +`).
   - **Taom Tafsilotlari (Bottom Sheet):** Hajm/porsiya tanlash (*Standart / Katta / XXL*) va qo'shimchalar (*Cheddar pishloq, Xalapenyo, Maxsus sous, Go'sht*) — real vaqtda dinamik narx hisoblash.
   - **Savatcha va Buyurtma Rasmiylashtirish (Checkout Drawer):**
     - Buyurtma turi: **🛵 Yetkazib berish** vs **🏃 Olib ketish (10% chegirma)**
     - Ism va telefon raqami
     - To'lov turlari: **Naqd pul**, **Click**, **Payme**
     - Bepul yetkazib berish indikatori (70 000 so'm threshold)
     - Konfetti animatsiyasi va muvaffaqiyatli buyurtma cheki (`#1042`).
   - **Pastki Suzuvchi Navigatsiya:** Asosiy, Menyu, bo'rtib chiqqan to'q sariq Savatcha tugmasi (ustida mahsulotlar soni bilan), Saralangan va Profil bo'limlari.

3. **Telegram Mini App (TMA) Integratsiyasi:**
   - Haptic Feedback (tebranish effektlari)
   - Foydalanuvchi ismi va parametrlarini avtomatik aniqlash (`initDataUnsafe.user`)
   - Telegram Webhook orqali botdan buyurtma ochish tugmasi
   - Buyurtma tushganda Telegram bot orqali oshxona va kuryerlar guruhiga to'liq chek xabari yuborilishi (`/api/order`).

---

## 🛠️ 2. O'rnatish va Mahalliy Ishga Tushirish

```bash
# 1. Loyiha papkasiga o'ting
cd c:\Users\iqbol\OneDrive\Desktop\fastfood

# 2. Paketlarni o'rnatish (o'rnatilgan bo'lsa shart emas)
npm install

# 3. Development rejimida ishga tushirish
npm run dev
```

Brauzerda ochish: [http://localhost:3000](http://localhost:3000)

---

## 🤖 3. Telegram Bot va Webhook Sozlash

Telegram bot ochib, ushbu ilovani uning ichida Mini App sifatida ulash juda oson:

### 1-qadam: BotFather'dan Bot va WebApp yaratish
1. Telegramda [@BotFather](https://t.me/BotFather) botiga kiring.
2. `/newbot` buyrug'i orqali yangi bot oching va berilgan **API Token**ni oling.
3. BotFather ga `/newapp` buyrug'ini yuboring:
   - Botingizni tanlang.
   - Mini App nomi va tavsifini kiriting.
   - Mini App rasmini yuklang.
   - URL so'raganda o'zingizning Vercel manzilingizni kiriting: `https://sizning-domen.vercel.app`
   - Qisqa nom (short name) bering (masalan: `app` yoki `order`).

### 2-qadam: Webhook'ni ulash
Deploy qilganingizdan so'ng, brauzerda yoki terminalda quyidagi so'rovni yuboring:
```bash
curl -F "url=https://sizning-domen.vercel.app/api/telegram/webhook" https://api.telegram.org/bot<SIZNING_BOT_TOKENINGIZ>/setWebhook
```
Shunda foydalanuvchi botga `/start` yozganida, bot avtomatik ravishda **🍽️ Taom Buyurtma Qilish** inline tugmasi bilan javob qaytaradi!

---

## ☁️ 4. Vercel ga Deploy qilish

1. Loyihani GitHub reponizga push qiling:
```bash
git add .
git commit -m "feat: complete fast-food telegram mini app"
git branch -M main
git remote add origin https://github.com/sizning-profil/fastfood-tma.git
git push -u origin main
```

2. [vercel.com](https://vercel.com) ga kiring va GitHub reposini import qiling.
3. **Environment Variables** bo'limida quyidagilarni kiriting:
   - `TELEGRAM_BOT_TOKEN`: BotFather'dan olingan bot tokeni
   - `TELEGRAM_ADMIN_CHAT_ID`: Buyurtmalar yuboriladigan admin yoki guruh Chat IDsi
   - `NEXT_PUBLIC_APP_URL`: Vercel taqdim etgan domen (masalan: `https://chinar-fastfood.vercel.app`)
4. **Deploy** tugmasini bosing. 1 daqiqada tayyor bo'ladi!

---

## 🎨 5. Yangi Kafe yoki Restoranga 10 daqiqada moslash

`src/config/brand.ts` faylini oching va quyidagi qatorlarni o'zgartiring:
```typescript
export const brandConfig: BrandConfig = {
  brandName: "Pitsa & Burger House",
  brandTagline: "Toshkentdagi eng mazali pitsalar",
  brandGreeting: "Xush kelibsiz! 🍕",
  city: "Toshkent",
  defaultAddress: "Amir Temur shoh ko'chasi, 24",
  deliveryTime: "25-30 daqiqa",
  freeDeliveryThreshold: 80000,
  deliveryFee: 15000,
  // ...
};
```
Ilova avtomatik ravishda barcha sarlavhalar, hisob-kitoblar va taomlarni yangilaydi!
