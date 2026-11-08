import { NextRequest, NextResponse } from "next/server";
import { brandConfig } from "@/config/brand";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://t.me");

export async function GET() {
  return NextResponse.json({
    status: "ok",
    bot: "Telegram WebApp Webhook Service",
    brand: brandConfig.brandName,
    appUrl: APP_URL,
    tokenConfigured: Boolean(TELEGRAM_BOT_TOKEN),
    info: "Send POST updates from Telegram Bot Webhook to this URL.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!TELEGRAM_BOT_TOKEN) {
      console.warn("TELEGRAM_BOT_TOKEN is not set in environment variables.");
      return NextResponse.json({ ok: true, notice: "Token not configured" });
    }

    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text;
    const user = message.from;

    // Handle /start command or general greeting
    if (text?.startsWith("/start") || text?.toLowerCase() === "start") {
      const welcomeText =
        `🍔 *${brandConfig.brandName}* ga xush kelibsiz, ${user?.first_name || "Aziz mehmon"}!\n\n` +
        `🚀 *Tezkor yetkazib berish:* 30-35 daqiqa\n` +
        `🎁 *Aksiya:* 70 000 so'mdan yuqori buyurtmalar uchun bepul yetkazib berish!\n\n` +
        `Quyidagi tugma orqali ilovani oching va mazali taomlarni tanlang:`;

      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeText,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🍽️ Taom Buyurtma Qilish (Mini App)",
                  web_app: { url: APP_URL },
                },
              ],
              [
                {
                  text: "📞 Aloqa",
                  callback_data: "contact",
                },
                {
                  text: "📍 Manzilimiz",
                  callback_data: "address",
                },
              ],
            ],
          },
        }),
      });

      // Also set the main bottom ReplyKeyboardMarkup WebApp button for convenience
      await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Menyuni ko'rish uchun quyidagi tugmani ham ishlatishingiz mumkin:",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "🚀 Buyurtma berish (Mini App)",
                  web_app: { url: APP_URL },
                },
              ],
            ],
            resize_keyboard: true,
          },
        }),
      });
    }

    // Handle data sent from WebApp (via window.Telegram.WebApp.sendData)
    if (message.web_app_data) {
      try {
        const orderData = JSON.parse(message.web_app_data.data);
        const receiptText =
          `✅ *Buyurtmangiz qabul qilindi!*\n\n` +
          `📦 Buyurtma raqami: *#${orderData.orderId}*\n` +
          `💰 Jami: *${orderData.totalAmount?.toLocaleString()} so'm*\n` +
          `📍 Manzil: ${orderData.address || "Yetkazib berish"}\n` +
          `⏱ Yetkazib berish vaqti: 35 daqiqa\n\n` +
          `Oshpazlarimiz taomingizni tayyorlamoqda! 👨‍🍳`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: receiptText,
            parse_mode: "Markdown",
          }),
        });
      } catch (err) {
        console.warn("Failed to parse web_app_data:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ ok: false, error: "Internal Error" }, { status: 500 });
  }
}
