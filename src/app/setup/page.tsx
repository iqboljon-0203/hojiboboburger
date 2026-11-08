"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Globe,
  Key,
  ShieldCheck,
  Loader2,
  Users,
  Save,
  HelpCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { brandConfig } from "@/config/brand";
import { HojiBoboLogo } from "@/components/HojiBoboLogo";

interface DetectedGroup {
  id: number;
  title: string;
  type: string;
}

export default function SetupPage() {
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [adminChatId, setAdminChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [detectedGroups, setDetectedGroups] = useState<DetectedGroup[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/telegram/webhook`);
    }
  }, []);

  // 1. Auto-detect Group IDs via getUpdates
  const handleFindGroups = async () => {
    if (!botToken.trim()) {
      alert("Avval yuqoridagi maydonga Bot Tokeningizni kiriting!");
      return;
    }
    setLoading(true);
    setResult(null);
    setDetectedGroups([]);

    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "findGroups",
          botToken: botToken.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.groups && data.groups.length > 0) {
          setDetectedGroups(data.groups);
          const firstGroup = data.groups[0];
          setAdminChatId(String(firstGroup.id));
          setStatusType("success");
          setResult(
            `🎉 Guruh muvaffaqiyatli topildi!\n` +
            `Guruh nomi: "${firstGroup.title}"\n` +
            `Guruh ID: ${firstGroup.id}\n\n` +
            `ID maydonga avtomatik kiritildi. Endi "Sinov Xabari Yuborish" tugmasini bosib tekshirib ko'rishingiz mumkin!`
          );
        } else {
          setStatusType("error");
          setResult(
            `ℹ️ Bot hozircha guruhdan yangi xabar olmadi.\n\n` +
            `Quyidagi 2 qadamni bajaring:\n` +
            `1. Telegramda botingizni guruhga qo'shing va Admin qiling.\n` +
            `2. O'sha guruhga istalgan bitta xabar yozing (masalan: "salom" yoki "/start").\n` +
            `3. Keyin yana ushbu "🔍 Guruh ID sini topish" tugmasini bosing!\n\n` +
            `Yoki brauzer orqali to'g'ridan-to'g'ri ochib ko'ring:\n` +
            `https://api.telegram.org/bot${botToken.trim()}/getUpdates`
          );
        }
      } else {
        setStatusType("error");
        setResult(`❌ Xatolik: ${data.error}`);
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  // 2. Save Config to .env.local
  const handleSaveConfig = async () => {
    if (!botToken.trim() || !adminChatId.trim()) {
      alert("Iltimos, Bot Token va Guruh Chat ID sini kiriting!");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveConfig",
          botToken: botToken.trim(),
          chatId: adminChatId.trim(),
          appUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setStatusType("success");
        setResult("✅ Sozlamalar .env.local ga muvaffaqiyatli saqlandi!");
      } else {
        setStatusType("error");
        setResult(`❌ Xatolik: ${data.error}`);
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  // 3. Test Message to Telegram Group
  const handleSendTestMessage = async () => {
    if (!botToken.trim() || !adminChatId.trim()) {
      alert("Bot Token va Guruh Chat ID sini kiriting!");
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
        setResult(
          "🎉 AJOYIB! Katta rasmli test buyurtmasi Telegram guruhiga muvaffaqiyatli bordi!\nEndi mijozlarning barcha buyurtmalari avtomatik ushbu guruhga tushadi."
        );
      } else {
        setStatusType("error");
        setResult(
          `❌ Telegram xatosi: ${data.data?.description || data.error}\n\nEslatma: Botni guruhga qo'shib, unga 'Admin' huquqini berganingizga ishonch hosil qiling.`
        );
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatusType("error");
      const message = err instanceof Error ? err.message : "Tarmoq xatosi";
      setResult(`❌ Xatolik: ${message}`);
    }
  };

  // 4. Set Webhook
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

  return (
    <div className="min-h-screen bg-[#FBF9F5] p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-100 space-y-5">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ilovaga qaytish</span>
          </Link>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            Telegram Guruh Integratsiyasi
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <HojiBoboLogo size={46} />
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Buyurtmalarni Telegram Guruhga Ulash
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Saytdan berilgan barcha buyurtmalar to&apos;g&apos;ridan-to&apos;g&apos;ri guruhga tushadi.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5">
          {/* 1. Bot Token */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>1. Telegram Bot Token (BotFather&apos;dan):</span>
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Masalan: 7891234567:AAHxyz..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* 2. Group Chat ID with Auto Detect Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>2. Telegram Guruh ID:</span>
              </label>

              {/* One-click Auto Detect Button */}
              <button
                type="button"
                onClick={handleFindGroups}
                disabled={loading || !botToken.trim()}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-3 h-3" />
                <span>Guruh ID sini avtomatik topish</span>
              </button>
            </div>

            <input
              type="text"
              value={adminChatId}
              onChange={(e) => setAdminChatId(e.target.value)}
              placeholder="Masalan: -1002345678901 yoki -456789012"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />

            {/* Detected groups list picker */}
            {detectedGroups.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-blue-900 block">
                  Topilgan guruhlar (tanlash uchun bosing):
                </span>
                {detectedGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setAdminChatId(String(g.id))}
                    className="w-full text-left p-1.5 rounded-lg bg-white border border-blue-200 text-xs flex items-center justify-between hover:bg-blue-100/50 transition-colors"
                  >
                    <span className="font-bold text-slate-800">
                      👥 {g.title}
                    </span>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {g.id}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <p className="text-[10px] text-slate-400 mt-1">
              Guruh ID odatda minus <b>-</b> yoki <b>-100</b> bilan boshlanadi.
            </p>
          </div>

          {/* 3. Webhook URL */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Webhook manzili (Avtomatik):</span>
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSendTestMessage}
            disabled={loading || !botToken || !adminChatId}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-red-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Guruhga Katta Rasmli Sinov Xabari Yuborish</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSaveConfig}
              disabled={loading || !botToken || !adminChatId}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Sozlamani Saqlash</span>
            </button>

            <button
              onClick={handleSetWebhook}
              disabled={loading || !botToken}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Webhook Ulash</span>
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

        {/* Step-by-Step Guide for Browser getUpdates */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>Brauzerda Bot Token orqali Guruh ID sini olish yo&apos;riqnomasi:</span>
          </div>
          <ol className="text-[11px] text-slate-600 space-y-1.5 pl-4 list-decimal leading-relaxed">
            <li>
              Telegramda guruh oching va o&apos;z botingizni guruhga <b>Admin</b> qilib qo&apos;shing.
            </li>
            <li>
              Guruhga istalgan bitta xabar yozing (masalan: <code>test</code> yoki <code>salom</code>).
            </li>
            <li>
              Brauzeringizda quyidagi havolani oching:
              <div className="mt-1 p-2 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] break-all select-all">
                {botToken.trim()
                  ? `https://api.telegram.org/bot${botToken.trim()}/getUpdates`
                  : `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`}
              </div>
            </li>
            <li>
              Ochilgan sahifadan <code>&quot;chat&quot;:&#123;&quot;id&quot;: -100...&#125;</code> qatorini toping.
              O&apos;sha <b>-100</b> bilan boshlanadigan son — sizning Guruh ID ingizdir!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
