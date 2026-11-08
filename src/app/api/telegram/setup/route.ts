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

    // Action 4: Auto-detect Group IDs via getUpdates
    if (action === "findGroups") {
      let resp = await fetch(
        `https://api.telegram.org/bot${botToken}/getUpdates`
      );
      let data = await resp.json();

      // If webhook is active, Telegram blocks getUpdates with code 409
      if (!data.ok && data.error_code === 409) {
        // Temporarily clear webhook to read updates
        await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
        resp = await fetch(
          `https://api.telegram.org/bot${botToken}/getUpdates`
        );
        data = await resp.json();
      }

      if (!data.ok) {
        return NextResponse.json({
          success: false,
          error: data.description || "getUpdates xatoligi",
        });
      }

      const groupsMap = new Map<
        string,
        { id: number; title: string; type: string }
      >();

      for (const update of data.result || []) {
        const msg =
          update.message || update.channel_post || update.my_chat_member;
        const chat = msg?.chat;
        if (
          chat &&
          (chat.type === "group" ||
            chat.type === "supergroup" ||
            chat.type === "channel")
        ) {
          groupsMap.set(String(chat.id), {
            id: chat.id,
            title: chat.title || "Guruh",
            type: chat.type,
          });
        }
      }

      return NextResponse.json({
        success: true,
        groups: Array.from(groupsMap.values()),
        totalUpdates: data.result?.length || 0,
      });
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

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: "📍 Xaritada ko'rish (Lokatsiya)",
              url: "https://maps.google.com/?q=Toshkent",
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
      };

      const photoPath = path.join(process.cwd(), "public", "images", "bot-welcome.jpg");
      let sentPhoto = false;

      if (fs.existsSync(photoPath)) {
        try {
          const imageBuffer = fs.readFileSync(photoPath);
          const formData = new FormData();
          formData.append("chat_id", chatId.trim());
          formData.append(
            "photo",
            new Blob([imageBuffer], { type: "image/jpeg" }),
            "welcome.jpg"
          );
          formData.append("caption", testOrderHtml);
          formData.append("parse_mode", "HTML");
          formData.append("reply_markup", JSON.stringify(inlineKeyboard));

          const photoResp = await fetch(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            {
              method: "POST",
              body: formData,
            }
          );
          const photoData = await photoResp.json();
          if (photoData.ok) {
            sentPhoto = true;
            return NextResponse.json({ success: true, data: photoData });
          }
        } catch (e) {
          console.warn("Setup sendPhoto warning:", e);
        }
      }

      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId.trim(),
            text: testOrderHtml,
            parse_mode: "HTML",
            reply_markup: inlineKeyboard,
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
