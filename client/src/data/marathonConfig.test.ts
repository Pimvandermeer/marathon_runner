import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { packSchema } from "@/data/packSchema";
import { getPublishedPacks, packs, resolveMarathon, STORAGE_KEY, todayIn, waveOptionLabel } from "@/data/marathonConfig";
import { createSafeStorage, type KeyValueStorage } from "@/lib/safeStorage";
import { calculateRunnerPredictions } from "@/data/staticData";

const TODAY = "2026-10-14";

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = v; },
    removeItem: (k) => { delete data[k]; },
  };
}

describe("published packs", () => {
  it("every registered pack satisfies packSchema", () => {
    for (const pack of packs) expect(() => packSchema.parse(pack)).not.toThrow();
  });

  it("Amsterdam 2026 is published; the 2025 editions are not registered", () => {
    expect(packs.map((p) => p.id)).toEqual(["amsterdam-2026"]);
  });

  it("pins the organiser-verified race values (docs/designs/amsterdam-2026-verification.md)", () => {
    const ams = packs[0];
    expect(ams.date).toBe("2026-10-18");
    expect(ams.timezone).toBe("Europe/Amsterdam");
    expect(ams.waveStartTimes).toEqual({ "1": "09:00", "2": "09:02", "3": "09:11", "4": "09:24", "5": "09:34", "6": "09:43" });
    expect(Object.values(ams.waveLabels ?? {}).map((l) => l.en)).toEqual(["white", "yellow", "pink", "orange", "green", "blue"]);
  });

  it("every course map image a pack references exists in client/public", () => {
    for (const pack of packs) {
      if (!pack.routeMap) continue;
      for (const file of [pack.routeMap.preview, pack.routeMap.full]) {
        expect(existsSync(path.join(process.cwd(), "client", "public", file)), file).toBe(true);
      }
    }
  });

  it("a pack is published up to and including race day, then drops out", () => {
    expect(getPublishedPacks("2026-10-18").map((p) => p.id)).toEqual(["amsterdam-2026"]);
    expect(getPublishedPacks("2026-10-19")).toEqual([]);
  });

  it("every Amsterdam stop gets a passing time; finish at pace 5:00 from wave 3 is 12:41", () => {
    const r = calculateRunnerPredictions({ wave: "3", pace: "5:00", runnerName: "T", id: "t" }, packs[0]);
    expect(r.locationTimes).toHaveLength(packs[0].viewingLocations.length);
    expect(r.locationTimes[0].estimatedTime).toBe("9:11");
    expect(r.estimatedFinish).toBe("12:41"); // 09:11 + 210.975 min floored
  });

  it("rejects a pack with a wave label for a missing wave, unsorted stops or a placeholder date", () => {
    const base = structuredClone(packs[0]) as any;
    expect(packSchema.safeParse({ ...base, waveLabels: { ...base.waveLabels, "9": { en: "x", nl: "x" } } }).success).toBe(false);
    expect(packSchema.safeParse({ ...base, viewingLocations: [...base.viewingLocations].reverse() }).success).toBe(false);
    expect(packSchema.safeParse({ ...base, date: "YYYY-MM-DD" }).success).toBe(false);
    expect(packSchema.safeParse({ ...base, waveStartTimes: { "1": "09:10", "2": "09:00" } }).success).toBe(false);
  });
});

describe("resolveMarathon precedence", () => {
  it("a link id wins over the stored id and is remembered", () => {
    const storage = memoryStorage({ [STORAGE_KEY]: "something-else" });
    const r = resolveMarathon({ linkId: "amsterdam-2026", storage, today: TODAY });
    expect(r).toMatchObject({ kind: "ok", source: "link" });
    expect(storage.data[STORAGE_KEY]).toBe("amsterdam-2026");
  });

  it("an unpublished link id is reported, never silently replaced", () => {
    const r = resolveMarathon({ linkId: "rotterdam", storage: memoryStorage(), today: TODAY });
    expect(r.kind).toBe("unknown");
  });

  it("a stale stored id is discarded and the default is used", () => {
    const storage = memoryStorage({ [STORAGE_KEY]: "rotterdam" });
    const r = resolveMarathon({ storage, today: TODAY });
    expect(r).toMatchObject({ kind: "ok", source: "default" });
    expect(storage.data[STORAGE_KEY]).toBeUndefined();
  });

  it("after race day nothing is published", () => {
    expect(resolveMarathon({ storage: memoryStorage(), today: "2026-10-19" }).kind).toBe("none");
  });

  it("storage that throws on every call degrades to the default without crashing", () => {
    const throwing: KeyValueStorage = {
      getItem: () => { throw new Error("SecurityError"); },
      setItem: () => { throw new Error("SecurityError"); },
      removeItem: () => { throw new Error("SecurityError"); },
    };
    const safe = createSafeStorage(() => throwing);
    expect(resolveMarathon({ storage: safe, today: TODAY })).toMatchObject({ kind: "ok", source: "default" });
    expect(resolveMarathon({ linkId: "amsterdam-2026", storage: safe, today: TODAY })).toMatchObject({ kind: "ok", source: "link" });
  });

  it("missing storage backend reads as empty", () => {
    expect(createSafeStorage(() => null).getItem("x")).toBeNull();
  });
});

describe("helpers", () => {
  it("todayIn uses the pack's time zone, not the device clock's", () => {
    // 22:30 UTC on 17 Oct is already 18 Oct in Amsterdam (CEST, UTC+2)
    expect(todayIn("Europe/Amsterdam", new Date("2026-10-17T22:30:00Z"))).toBe("2026-10-18");
  });

  it("wave labels render with colour when the pack has them", () => {
    expect(waveOptionLabel(packs[0], "3", "en", "Wave")).toBe("Wave 3 (pink) 09:11");
    expect(waveOptionLabel(packs[0], "3", "nl", "Golf")).toBe("Golf 3 (roze) 09:11");
    const unlabeled = { ...packs[0], waveLabels: undefined };
    expect(waveOptionLabel(unlabeled, "3", "en", "Wave")).toBe("Wave 3 - 09:11");
  });
});
