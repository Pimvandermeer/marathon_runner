import { packSchema, type MarathonPack, type Localized } from "@/data/packSchema";
import { safeStorage, type KeyValueStorage } from "@/lib/safeStorage";
import amsterdam2026 from "./marathons/amsterdam-2026.json";

/**
 * Registry of PUBLISHED packs only. A pack is published when its values have
 * been verified against the organiser (see docs/designs, Data Verification).
 * rotterdam.json and amsterdam.json stay on disk for Approach B but are not
 * imported: their values are a past edition.
 */
function load(raw: unknown, file: string): MarathonPack {
  const parsed = packSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid marathon pack ${file}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  return parsed.data;
}

export const packs: readonly MarathonPack[] = [load(amsterdam2026, "amsterdam-2026.json")];

export const STORAGE_KEY = "selectedMarathon";

/** Today's date as YYYY-MM-DD in the given time zone. */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Published packs whose race day has not passed yet (race day itself counts). */
export function getPublishedPacks(today?: string, all: readonly MarathonPack[] = packs): MarathonPack[] {
  return all.filter((p) => p.date >= (today ?? todayIn(p.timezone)));
}

export type Resolution =
  | { kind: "ok"; pack: MarathonPack; source: "link" | "storage" | "default" }
  | { kind: "unknown"; id: string; fallback: MarathonPack | null }
  | { kind: "none" };

/**
 * Decide which marathon the page shows.
 * Precedence: marathon id in the link > stored choice > the first published pack.
 * An id that is not published is never used: a link with one is reported as
 * unknown (the caller shows a notice), a stored one is discarded.
 */
export function resolveMarathon(opts: {
  linkId?: string | null;
  storage?: KeyValueStorage;
  today?: string;
  all?: readonly MarathonPack[];
}): Resolution {
  const storage = opts.storage ?? safeStorage;
  const published = getPublishedPacks(opts.today, opts.all ?? packs);
  const fallback = published[0] ?? null;

  if (opts.linkId) {
    const fromLink = published.find((p) => p.id === opts.linkId);
    if (fromLink) {
      storage.setItem(STORAGE_KEY, fromLink.id);
      return { kind: "ok", pack: fromLink, source: "link" };
    }
    return { kind: "unknown", id: opts.linkId, fallback };
  }

  const storedId = storage.getItem(STORAGE_KEY);
  if (storedId) {
    const stored = published.find((p) => p.id === storedId);
    if (stored) return { kind: "ok", pack: stored, source: "storage" };
    storage.removeItem(STORAGE_KEY);
  }

  return fallback ? { kind: "ok", pack: fallback, source: "default" } : { kind: "none" };
}

export function setCurrentMarathon(id: string, storage: KeyValueStorage = safeStorage): void {
  storage.setItem(STORAGE_KEY, id);
}

export function findPublishedPack(id: string, today?: string): MarathonPack | undefined {
  return getPublishedPacks(today).find((p) => p.id === id);
}

export function localize(value: Localized, language: string): string {
  return language === "nl" ? value.nl : value.en;
}

/** "Wave 3 (pink) 09:11" when the pack labels waves, else "Wave 3 - 09:11". */
export function waveOptionLabel(pack: MarathonPack, wave: string, language: string, waveWord: string): string {
  const time = pack.waveStartTimes[wave];
  const label = pack.waveLabels?.[wave];
  return label ? `${waveWord} ${wave} (${localize(label, language)}) ${time}` : `${waveWord} ${wave} - ${time}`;
}

export function getSpectatorTips(pack: MarathonPack, language: string): string[] {
  return language === "nl" ? pack.spectatorTips.nl : pack.spectatorTips.en;
}
