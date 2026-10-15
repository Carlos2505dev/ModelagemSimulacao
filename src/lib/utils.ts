import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SUPER_DIGITS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

/** Converte "x^2" em "x²": circunflexo seguido de dígitos vira expoente de verdade. */
export function sup(s: string): string {
  return s.replace(/\^(\d+)/g, (_, ds: string) =>
    [...ds].map((d) => SUPER_DIGITS[d] ?? d).join(""),
  );
}
