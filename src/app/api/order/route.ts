import { NextRequest, NextResponse } from "next/server";
import { PlacedOrder } from "@/context/CartContext";

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
const TELEGRAM_GROUP_ID =
  process.env.TELEGRAM_ADMIN_CHAT_ID ||
  process.env.TELEGRAM_CHAT_ID ||
  process.env.TELEGRAM_GROUP_ID;

// Helper to escape HTML characters in Telegram
function escapeHtml(text: string | number | undefined): string {
  if (text === undefined || text === null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const order: PlacedOrder = await req.json();

    if (!order || !order.orderId) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Clean phone number for tel: link (digits only with optional +)
    const cleanPhone = (order.customerPhone || "").replace(/[^\d+]/g, "");

    // Format item list in clean HTML
    const itemsList = order.items
      .map((item, idx) => {
        const sizeStr = item.selectedSize
          ? ` <i>(${escapeHtml(item.selectedSize.name)})</i>`
          : "";
        const addonsStr =
          item.selectedAddons.length > 0
            ? `\n   └ <i>+ ${item.selectedAddons
                .map((a) => escapeHtml(a.name))
                .join(", ")}</i>`
            : "";
        return `${idx + 1}. <b>${item.quantity}x ${escapeHtml(
          item.product.name
        )}</b>${sizeStr}${addonsStr}\n   💰 ${item.totalPrice.toLocaleString()} so'm`;
      })
      .join("\n\n");

    const orderTypeLabel =
      order.orderType === "delivery"
        ? "🛵 Yetkazib berish (Dostavka)"
        : "🏪 Kafedan olib ketish (-10% chegirma)";

    const paymentLabel =
      order.paymentMethod === "click"
        ? "🔵 CLICK"
        : order.paymentMethod === "payme"
        ? "🟢 PAYME"
        : "💵 Naqd pul";

    // Formatted Telegram message
    const messageHtml =
      `🔥 <b>YANGI BUYURTMA #${escapeHtml(order.orderId)}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}\n` +
      `📞 <b>Telefon:</b> <a href="tel:${cleanPhone}">${escapeHtml(
        order.customerPhone
      )}</a>\n` +
      `🛵 <b>Buyurtma turi:</b> ${orderTypeLabel}\n` +
      `📍 <b>Manzil:</b> ${escapeHtml(order.address)}\n` +
      (order.notes ? `📝 <b>Izoh:</b> ${escapeHtml(order.notes)}\n` : "") +
      `💳 <b>To'lov turi:</b> ${paymentLabel}\n\n` +
      `📋 <b>BUYURTMA TARKIBI:</b>\n` +
      `${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 <b>Taomlar:</b> ${order.subtotal.toLocaleString()} so'm\n` +
      (order.deliveryFee > 0
        ? `🛵 <b>Yetkazish:</b> ${order.deliveryFee.toLocaleString()} so'm\n`
        : `🛵 <b>Yetkazish:</b> <b>BEPUL</b> 🎉\n`) +
      (order.discount > 0
        ? `🎁 <b>Chegirma:</b> -${order.discount.toLocaleString()} so'm\n`
        : "") +
      `💰 <b>JAMI TO'LOV: ${order.totalAmount.toLocaleString()} so'm</b>\n` +
      `⏰ <b>Vaqt:</b> ${escapeHtml(order.createdAt)}`;

    // Build interactive inline buttons (NOTE: Telegram inline_keyboard only supports http/https/tg URLs)
    const inlineKeyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>> = [];

    // Row 1: Map location button if address exists
    if (order.address && order.orderType === "delivery") {
      inlineKeyboard.push([
        {
          text: "📍 Xaritada ko'rish (Lokatsiya)",
          url: `https://maps.google.com/?q=${encodeURIComponent(
            order.address + ", Toshkent"
          )}`,
        },
      ]);
    }

    // Row 2: Status management buttons for Kitchen / Courier
    inlineKeyboard.push([
      {
        text: "✅ Qabul qilish",
        callback_data: `accept_${order.orderId}`,
      },
      {
        text: "🛵 Kuryerga berish",
        callback_data: `courier_${order.orderId}`,
      },
    ]);

    // Send to Telegram group if token and group ID are configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_GROUP_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: messageHtml,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        }),
      });

      const resData = await res.json();
      if (!resData.ok) {
        console.error("Telegram API Error:", resData);
      }
    } else {
      console.log(
        "[Telegram Group Notice] Telegram bot token or group ID not configured. Order simulated:\n",
        messageHtml
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
