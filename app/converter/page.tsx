// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

import { ConverterClient } from "@/components/converter/converter-client";

export default function ConverterPage() {
  return <ConverterClient />;
}
