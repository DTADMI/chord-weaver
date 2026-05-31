export type LocaleCode = "en" | "fr";

export interface Language {
  code: LocaleCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
];

export const defaultLocale: LocaleCode = "fr";

export const i18nConfig = {
  cookieName: "chord-weaver-locale",
  storageKey: "chord-weaver-locale",
  defaultLocale: "fr" as LocaleCode,
  supportedLocales: ["en", "fr"] as LocaleCode[],
  rtlLocales: [] as LocaleCode[],
};

export const { cookieName: COOKIE_NAME, storageKey: STORAGE_KEY } = i18nConfig;
