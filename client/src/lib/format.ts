import type { Language } from "@/contexts/LanguageContext";

/** Colour swatch for an organiser wave label ("pink" -> CSS colour). Unknown labels get none. */
const SWATCHES: Record<string, string> = {
  white: "#ffffff",
  yellow: "#facc15",
  pink: "#f472b6",
  orange: "#fb923c",
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
  purple: "#a855f7",
  black: "#111827",
  grey: "#9ca3af",
  gray: "#9ca3af",
};

export function waveSwatch(labelEn: string | undefined): string | undefined {
  return labelEn ? SWATCHES[labelEn.toLowerCase()] : undefined;
}

/** "Sunday 18 October 2026" / "zondag 18 oktober 2026" for a YYYY-MM-DD race date. */
export function formatRaceDate(isoDate: string, language: Language): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date);
}

/** 21.1 -> "21.1" (en) / "21,1" (nl); whole numbers without decimals. */
export function formatKm(km: number, language: Language): string {
  const rounded = Math.round(km * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return language === "nl" ? text.replace(".", ",") : text;
}

/** Zero-pad the hour of an H:MM time for display ("9:11" -> "09:11"). */
export function padTime(time: string): string {
  return /^\d:\d\d$/.test(time) ? `0${time}` : time;
}

export function directionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=transit`;
}

/** Keep digits only and insert the colon before the last two digits: "530" -> "5:30". */
export function formatClockInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, -2)}:${digits.slice(-2)}` : digits;
}

export const CLOCK = /^\d{1,2}:[0-5]\d$/;
