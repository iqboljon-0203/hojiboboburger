import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { botToken, webhookUrl, action, chatId, appUrl } = await req.json();

    // Action: Save Config to .env.local
    if (action === "saveConfig") {
      if (!botToken || !chatId) {
        return NextResponse.json(
          { success: false, error: "Bot Token va Guruh Chat ID kiritilishi shart" },
          { status: 400 }
        );
      }

      const envPath = path.join(process.cwd(), ".env.local");
      const envContent =
        `# Telegram Bot Configuration\n` +
        `TELEGRAM_BOT_TOKEN=${botToken.trim()}\n` +
        `TELEGRAM_ADMIN_CHAT_ID=${chatId.trim()}\n` +
        `TELEGRAM_GROUP_ID=${chatId.trim()}\n` +
        `NEXT_PUBLIC_APP_URL=${(appUrl || "http://localhost:3000").trim()}\n`;

      fs.writeFileSync(envPath, envContent, "utf-8");

      // Update process.env in memory immediately for local testing
      process.env.TELEGRAM_BOT_TOKEN = botToken.trim();
      process.env.TELEGRAM_ADMIN_CHAT_ID = chatId.trim();
      process.env.TELEGRAM_GROUP_ID = chatId.trim();
      if (appUrl) process.env.NEXT_PUBLIC_APP_URL = appUrl.trim();

      return NextResponse.json({
        success: true,
        message: ".env.local fayli muvaffaqiyatli saqlandi!",
      });
    }

    if (!botToken) {
      return NextResponse.json(
        { success: false, error: "Bot token kiritilmadi" },
        { status: 400 }
      );
    }

    // Action 1: Get Webhook Info
    if (action === "getInfo") {
      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/getWebhookInfo`
      );
      const data = await resp.json();
      return NextResponse.json({ success: true, data });
    }

    // Action 2: Set Webhook
    if (action === "setWebhook") {
      if (!webhookUrl) {
        return NextResponse.json(
          { success: false, error: "Webhook URL kiritilmadi" },
          { status: 400 }
        );
      }

      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(
          webhookUrl
        )}`
      );
      const data = await resp.json();
      return NextResponse.json({ success: true, data });
    }

    // Action 3: Send Test Message to Group
    if (action === "testMessage") {
      if (!chatId) {
        return NextResponse.json(
          { success: false, error: "Guruh Chat ID si kiritilmadi" },
          { status: 400 }
        );
      }

      const testOrderHtml =
        `🔥 <b>HojiBobo Burger — TEST BUYURTMA</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ Telegram guruh bilan aloqa muvaffaqiyatli o'rnatildi!\n\n` +
        `👤 <b>Mijoz:</b> Test Foydalanuvchi\n` +
        `📞 <b>Telefon:</b> +998 90 123 45 67\n` +
        `📍 <b>Manzil:</b> Chilonzor 9, 12-uy\n` +
        `📋 <b>Taomlar:</b> 2x HojiBobo Special Josper Burger\n` +
        `💰 <b>Jami:</b> 84 000 so'm\n\n` +
        `<i>Endi mijozlar ilova orqali bergan har bir buyurtma avtomatik tarzda ushbu guruhga tushadi!</i>`;

      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId.trim(),
            text: testOrderHtml,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📞 Mijozga qo'ng'iroq",
                    url: "tel:+998901234567",
                  },
                ],
                [
                  {
                    text: "✅ Qabul qilish",
                    callback_data: "accept_test",
                  },
                  {
                    text: "🛵 Kuryerga berish",
                    callback_data: "courier_test",
                  },
                ],
              ],
            },
          }),
        }
      );
      const data = await resp.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: "Noma'lum amal" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
