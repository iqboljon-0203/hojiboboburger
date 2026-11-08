import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { botToken, webhookUrl, action, chatId } = await req.json();

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

    // Action 3: Send Test Message
    if (action === "testMessage") {
      if (!chatId) {
        return NextResponse.json(
          { success: false, error: "Chat ID kiritilmadi" },
          { status: 400 }
        );
      }

      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text:
              "🎉 *HojiBobo Burger Mini App sinovi muvaffaqiyatli o'tdi!*\n\n" +
              "Botingiz va veb-ilova webhook orqali to'liq bog'landi.",
            parse_mode: "Markdown",
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

