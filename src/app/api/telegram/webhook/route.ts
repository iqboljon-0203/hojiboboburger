import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { brandConfig } from "@/config/brand";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Clean URL without trailing slash for reliable path concatenation
const RAW_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://hojiboboburger.vercel.app");
const APP_URL = RAW_APP_URL.replace(/\/+$/, "");

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

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

    // 1. Handle Callback Queries (when admins click buttons in the Group)
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data;
      const adminName = cb.from?.first_name || cb.from?.username || "Admin";

      let alertText = "Amal bajarildi";
      let statusBadge = "";

      if (data?.startsWith("accept_")) {
        const orderId = data.replace("accept_", "");
        alertText = `Buyurtma #${orderId} qabul qilindi!`;
        statusBadge = `\n\n✅ <b>QABUL QILINDI</b> (Qabul qildi: <b>${adminName}</b>)`;
      } else if (data?.startsWith("courier_")) {
        const orderId = data.replace("courier_", "");
        alertText = `Buyurtma #${orderId} kuryerga topshirildi!`;
        statusBadge = `\n\n🛵 <b>KURYERGA TOPSHIRILDI</b> (Topshirdi: <b>${adminName}</b>)`;
      }

      // Answer callback query popup
      await fetch(`${telegramApiUrl}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: cb.id,
          text: alertText,
          show_alert: false,
        }),
      });

      // Update message text in the group if status was updated
      if (statusBadge && cb.message) {
        const originalText = cb.message.text || "";
        const updatedText = originalText + statusBadge;

        await fetch(`${telegramApiUrl}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: cb.message.chat.id,
            message_id: cb.message.message_id,
            text: updatedText,
            parse_mode: "HTML",
            reply_markup: cb.message.reply_markup,
          }),
        }).catch((e) => console.warn("Failed to edit message:", e));
      }

      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text;
    const user = message.from;

    // 2. Handle /start command or general greeting with large photo
    if (text?.startsWith("/start") || text?.toLowerCase() === "start") {
      const welcomeText =
        `🍔 <b>${brandConfig.brandName}</b> ga xush kelibsiz, ${user?.first_name || "Aziz mehmon"}!\n\n` +
        `🔥 <b>Josper Grill</b> — haqiqiy ko'mir taftida pishirilgan ASL shira bosgan burgerlar va taomlar!\n` +
        `🚀 <b>Tezkor yetkazib berish:</b> 30-35 daqiqa\n` +
        `🎁 <b>Aksiya:</b> 70 000 so'mdan yuqori buyurtmalar uchun yetkazib berish <b>bepul</b>!\n` +
        `📞 <b>Aloqa:</b> ${brandConfig.phoneNumber}\n\n` +
        `Quyidagi tugma orqali ilovani oching va issiq burgerlarni tanlang:`;

      // IMPORTANT: In Telegram InlineKeyboards, 'url' MUST be an http/https or tg:// URL. Never use 'tel:'.
      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "🍽️ Taom Buyurtma Qilish (Mini App)",
              web_app: { url: APP_URL },
            },
          ],
          [
            {
              text: "📍 Manzilimiz (Xarita)",
              url: "https://maps.google.com/?q=HojiBobo+Burger+Toshkent",
            },
            {
              text: "📸 Instagram",
              url: `https://instagram.com/${brandConfig.instagram.replace("@", "")}`,
            },
          ],
        ],
      };

      const photoUrl = `${APP_URL}/images/bot-welcome.jpg`;
      let photoSent = false;

      // 1. Try sending photo via public URL (Telegram fetches directly over HTTPS)
      try {
        const photoResp = await fetch(`${telegramApiUrl}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: photoUrl,
            caption: welcomeText,
            parse_mode: "HTML",
            reply_markup: inlineKeyboard,
          }),
        });
        const photoData = await photoResp.json();
        if (photoData.ok) {
          photoSent = true;
        } else {
          console.warn("sendPhoto via URL failed:", photoData);
        }
      } catch (err) {
        console.warn("sendPhoto URL fetch error:", err);
      }

      // 2. If URL send failed (e.g. localhost testing), try local file upload via FormData
      if (!photoSent) {
        const photoPath = path.join(process.cwd(), "public", "images", "bot-welcome.jpg");
        if (fs.existsSync(photoPath)) {
          try {
            const imageBuffer = fs.readFileSync(photoPath);
            const formData = new FormData();
            formData.append("chat_id", String(chatId));
            formData.append(
              "photo",
              new Blob([imageBuffer], { type: "image/jpeg" }),
              "welcome.jpg"
            );
            formData.append("caption", welcomeText);
            formData.append("parse_mode", "HTML");
            formData.append("reply_markup", JSON.stringify(inlineKeyboard));

            const localResp = await fetch(`${telegramApiUrl}/sendPhoto`, {
              method: "POST",
              body: formData,
            });
            const localData = await localResp.json();
            if (localData.ok) {
              photoSent = true;
            } else {
              console.warn("sendPhoto via local file failed:", localData);
            }
          } catch (localErr) {
            console.warn("sendPhoto local buffer error:", localErr);
          }
        }
      }

      // 3. Fallback to clean text message if photo could not be delivered
      if (!photoSent) {
        await fetch(`${telegramApiUrl}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeText,
            parse_mode: "HTML",
            reply_markup: inlineKeyboard,
          }),
        });
      }

      // 4. Send persistent bottom keyboard button
      await fetch(`${telegramApiUrl}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Menyuni ko'rish uchun pastdagi tugmani bosing:",
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ ok: false, error: "Internal Error" }, { status: 500 });
  }
}
