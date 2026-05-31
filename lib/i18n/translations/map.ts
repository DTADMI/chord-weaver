import en from "./en";
import fr from "./fr";

const translationsMap: Record<string, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  fr: fr as unknown as Record<string, unknown>,
};

export default translationsMap;
