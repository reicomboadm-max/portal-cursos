import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function parsePrice(input: string | number | undefined | null): number {
  if (typeof input === "number") return isNaN(input) ? 0 : input;
  if (!input) return 0;
  let str = String(input).trim().replace(/R\$\s?/gi, "").replace(/\s+/g, "");
  if (str.includes(",") && str.includes(".")) {
    str = str.replace(/\./g, "").replace(",", ".");
  } else if (str.includes(",")) {
    str = str.replace(",", ".");
  }
  const val = parseFloat(str);
  return isNaN(val) ? 0 : Math.round(val * 100) / 100;
}

export function formatPriceNumber(num: number): string {
  if (isNaN(num)) return "0,00";
  return num.toFixed(2).replace(".", ",");
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return dateString;
  }
}
