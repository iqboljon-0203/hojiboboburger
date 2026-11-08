import { NextRequest, NextResponse } from "next/server";
import { PlacedOrder } from "@/context/CartContext";
import { brandConfig } from "@/config/brand";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID =
  process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const order: PlacedOrder = await req.json();

    if (!order || !order.orderId) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Format rich Telegram notification message for the restaurant/courier group
    const itemsList = order.items
      .map((item, idx) => {
        const sizeStr = item.selectedSize ? ` (${item.selectedSize.name})` : "";
        const addonsStr =
          item.selectedAddons.length > 0
            ? `\n   + ${item.selectedAddons.map((a) => a.name).join(", ")}`
            : "";
        return `${idx + 1}. *${item.quantity}x ${item.product.name}*${sizeStr}${addonsStr} — ${item.totalPrice.toLocaleString()} so'm`;
      })
      .join("\n");

    const messageText =
      `🔔 *YANGI BUYURTMA #${order.orderId}*\n\n` +
      `👤 *Mijoz:* ${order.customerName}\n` +
      `📞 *Telefon:* \`${order.customerPhone}\`\n` +
      `🛵 *Buyurtma turi:* ${
        order.orderType === "delivery" ? "Yetkazib berish" : "Kafedan olib ketish (-10%)"
      }\n` +
      `📍 *Manzil:* ${order.address}\n` +
      (order.notes ? `📝 *Izoh:* ${order.notes}\n` : "") +
      `💳 *To'lov usuli:* ${order.paymentMethod.toUpperCase()}\n\n` +
      `📋 *Taomlar ro'yxati:*\n${itemsList}\n\n` +
      `💵 *Taomlar:* ${order.subtotal.toLocaleString()} so'm\n` +
      (order.deliveryFee > 0
        ? `🛵 *Yetkazish:* ${order.deliveryFee.toLocaleString()} so'm\n`
        : `🛵 *Yetkazish:* Bepul\n`) +
      (order.discount > 0
        ? `🎁 *Chegirma:* -${order.discount.toLocaleString()} so'm\n`
        : "") +
      `💰 *JAMI TO'LOV: ${order.totalAmount.toLocaleString()} so'm*\n` +
      `⏰ *Vaqt:* ${order.createdAt}`;

    // If bot token and admin chat ID are set, deliver to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text: messageText,
          parse_mode: "Markdown",
        }),
      });
    } else {
      console.log(
        "[Demo Order Notice] Telegram admin chat not configured. Simulated order received:\n",
        messageText
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
