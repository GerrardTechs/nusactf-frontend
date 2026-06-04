import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "Web Exploitation":
      return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    case "Cryptography":
      return "text-violet-400 border-violet-500/30 bg-violet-500/10";
    case "Forensics":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    default:
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  }
}
