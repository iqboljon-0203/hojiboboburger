"use client";

import { useEffect, useState, useCallback } from "react";
import type { TelegramUser, TelegramWebApp } from "@/types/telegram";

export function useTelegram() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      setTg(webApp);

      try {
        webApp.ready();
        webApp.expand();
        if (webApp.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user);
        }
      } catch (err) {
        console.warn("Telegram WebApp initialization error:", err);
      }
      setIsReady(true);
    }
  }, []);

  const triggerHaptic = useCallback(
    (style: "light" | "medium" | "heavy" = "light") => {
      try {
        if (tg?.HapticFeedback) {
          tg.HapticFeedback.impactOccurred(style);
        }
      } catch (e) {
        // Ignored in non-telegram browsers
      }
    },
    [tg]
  );

  const triggerNotification = useCallback(
    (type: "success" | "error" | "warning" = "success") => {
      try {
        if (tg?.HapticFeedback) {
          tg.HapticFeedback.notificationOccurred(type);
        }
      } catch (e) {
        // Ignored
      }
    },
    [tg]
  );

  const closeApp = useCallback(() => {
    if (tg?.close) {
      tg.close();
    }
  }, [tg]);

  const sendDataToBot = useCallback(
    (data: object | string) => {
      const payload = typeof data === "string" ? data : JSON.stringify(data);
      if (tg?.sendData) {
        tg.sendData(payload);
      } else {
        console.log("Mock TMA sendData (running outside Telegram):", payload);
      }
    },
    [tg]
  );

  return {
    tg,
    user,
    isReady,
    isInTelegram: Boolean(tg && tg.initData),
    triggerHaptic,
    triggerNotification,
    closeApp,
    sendDataToBot,
  };
}
