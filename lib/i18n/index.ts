export { I18nProvider, useI18n, useTranslation } from "./provider";
export {
  defaultLocale,
  i18nConfig,
  COOKIE_NAME,
  STORAGE_KEY,
  type LocaleCode,
  type Language,
} from "./config";
export type Translations = Record<string, unknown>;
