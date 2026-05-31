import { cookies, headers } from "next/headers";
import { i18nConfig } from "./config";
import translationsMap from "./translations/map";

export async function resolveLocale(): Promise<string> {
    try {
      const c = await cookies();
      const v = c.get(i18nConfig.cookieName)?.value;
      if (v && i18nConfig.supportedLocales.includes(v as never)) return v;
    } catch {
      // cookie resolution unavailable (SSR context)
    }

    try {
      const h = await headers();
      const m = (h.get("accept-language") || "").match(/[a-z]{2}(?:-[A-Z]{2})?/g);
      if (m) {
        for (const l of m) {
          const b = l.split("-")[0].toLowerCase();
          if (i18nConfig.supportedLocales.includes(b as never)) return b;
        }
      }
    } catch {
      // header resolution unavailable (SSR context)
    }

  return i18nConfig.defaultLocale;
}

export async function getServerTranslations() {
  const locale = await resolveLocale();
  const t = translationsMap[locale] || translationsMap.en || {};

  function tr(key: string, params?: Record<string, unknown>): string {
    const keys = key.split(".");
    let v: unknown = t;
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
  }

  return { locale, t: tr };
}
