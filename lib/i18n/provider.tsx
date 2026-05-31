"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { i18nConfig, type LocaleCode } from "./config";
import translationsMap from "./translations/map";

const I18nContext = createContext<{
  locale: LocaleCode;
  setLocale: (next: LocaleCode) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}>({
  locale: i18nConfig.defaultLocale as LocaleCode,
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: string;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(
    (initialLocale as LocaleCode) || i18nConfig.defaultLocale,
  );

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    try {
      localStorage.setItem(i18nConfig.storageKey, next);
    } catch {
      // localStorage unavailable (SSR or private browsing)
    }
    try {
      document.cookie = `${i18nConfig.cookieName}=${next};path=/;max-age=31536000`;
    } catch {
      // cookie unavailable (SSR)
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, unknown>): string => {
      const tMap = translationsMap[locale] || translationsMap.en || {};
      const keys = key.split(".");
      let v: unknown = tMap;
      for (const k of keys) {
        if (v && typeof v === "object" && k in v) {
          v = (v as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      let r = String(v ?? key);
      if (params) {
        for (const [pk, pv] of Object.entries(params)) {
          r = r.replace(`{{${pk}}}`, String(pv));
        }
      }
      return r;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useTranslation() {
  return useContext(I18nContext);
}
