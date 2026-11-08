"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Send, Globe, Key, ShieldCheck, Loader2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function SetupPage() {
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [adminChatId, setAdminChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/telegram/webhook`);
    }
  }, []);

  const handleSetWebhook = async () => {
    if (!botToken.trim()) {
      alert("Iltimos, Bot Tokeningizni kiriting!");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setWebhook",
          botToken: botToken.trim(),
          webhookUrl: webhookUrl.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.data?.ok) {
        setStatusType("success");
        setResult(`✅ Webhook muvaffaqiyatli ulandi!\n${data.data.description || "OK"}`);
      } else {
        setStatusType("error");
        setResult(`❌ Xatolik: ${data.data?.description || data.error || "Ulanmadi"}`);
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  const handleCheckWebhook = async () => {
    if (!botToken.trim()) {
      alert("Iltimos, Bot Tokeningizni kiriting!");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getInfo",
          botToken: botToken.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.data?.ok) {
        setStatusType("success");
        setResult(
          `ℹ️ Joriy Webhook holati:\nURL: ${data.data.result.url || "O'rnatilmagan"}\nKutilayotgan yangilanishlar: ${data.data.result.pending_update_count}`
        );
      } else {
        setStatusType("error");
        setResult(`❌ Xatolik: ${data.data?.description || data.error}`);
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  const handleSendTestMessage = async () => {
    if (!botToken.trim() || !adminChatId.trim()) {
      alert("Bot Token va Admin Chat ID sini kiriting!");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "testMessage",
          botToken: botToken.trim(),
          chatId: adminChatId.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.data?.ok) {
        setStatusType("success");
        setResult("✅ Test xabari Telegramingizga yuborildi!");
      } else {
        setStatusType("error");
        setResult(`❌ Xatolik: ${data.data?.description || data.error}`);
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ilovaga qaytish</span>
          </Link>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            Avtomat sozlash
          </span>
        </div>

        <div>
          <h1 className="text-lg font-black text-slate-900">
            🤖 Telegram Webhook Sozlash
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {brandConfig.brandName} botini hech qanday buyruq va curl ishlatmasdan 1 marta bosishda ulang.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Telegram Bot Token (BotFather&apos;dan):</span>
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Masalan: 123456789:ABCdefGHIjklMNOpqr..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Webhook manzili (Avtomatik):</span>
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
              <Send className="w-3.5 h-3.5 text-emerald-500" />
              <span>Admin yoki Guruh Chat ID (Test uchun):</span>
            </label>
            <input
              type="text"
              value={adminChatId}
              onChange={(e) => setAdminChatId(e.target.value)}
              placeholder="Masalan: 123456789 yoki -1001234567890"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSetWebhook}
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-red-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Webhook&apos;ni Avtomatik Ulash (setWebhook)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCheckWebhook}
              disabled={loading}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs active:scale-95 transition-all"
            >
              Holatni tekshirish
            </button>

            <button
              onClick={handleSendTestMessage}
              disabled={loading || !adminChatId}
              className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs active:scale-95 transition-all"
            >
              Test xabar yuborish
            </button>
          </div>
        </div>

        {/* Result Output Card */}
        {result && (
          <div
            className={`p-3.5 rounded-2xl border text-xs whitespace-pre-wrap font-mono ${
              statusType === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
