import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | undefined | false | Record<string, unknown> | ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  let result = "";
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      result += (result ? " " : "") + input;
    } else if (Array.isArray(input)) {
      result += (result ? " " : "") + clsx(...input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) result += (result ? " " : "") + key;
      }
    }
  }
  return result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
