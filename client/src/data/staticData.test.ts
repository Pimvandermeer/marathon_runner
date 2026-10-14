/**
 * R11 regression contract for client/src/data/staticData.ts
 * (docs/designs/marathon-supporter-multi-marathon.md, Section 3, D11/D12).
 *
 * These tests pin the CURRENT behaviour of the pace math before the PR2
 * rewrite (D8 removes currentLocation). They were written against the
 * unchanged file and must stay green across the rewrite for every
 * `locationTimes` and `runner.pace` assertion below.
 *
 * Only `calculateRunnerPredictions`, `getMarathonLocations` and
 * `getAllMarathonLocations` are exported. `paceToMinutes`,
 * `calculatePaceFromFinishTime` and `addTime` are module-internal, so each
 * is pinned through the public `calculateRunnerPredictions` output.
 *
 * Fixture: the currently registered Rotterdam pack
 * (client/src/data/marathons/rotterdam.json): wave 1 starts 10:00,
 * wave 3 starts 10:14, 16 viewing locations from 0 km to 42.195 km.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { calculateRunnerPredictions, getMarathonLocations } from "@/data/staticData";
import { runnerInputSchema } from "@shared/schema";

const ROTTERDAM_KMS = [0, 1, 5, 10, 13.1, 18.6, 21.1, 23.7, 25, 26.7, 28.2, 30, 35, 36.1, 40, 42.195];

function run(input: { wave: string; pace: string; finishTime: string; runnerName?: string }) {
  return calculateRunnerPredictions({
    id: "test-runner",
    runnerName: input.runnerName ?? "Test",
    wave: input.wave,
    pace: input.pace,
    finishTime: input.finishTime,
  });
}

function timesByKm(result: ReturnType<typeof calculateRunnerPredictions>): Record<string, string> {
  return Object.fromEntries(result.locationTimes.map((l) => [String(l.kilometer), l.estimatedTime]));
}

beforeEach(() => {
  // marathonConfig reads localStorage("selectedMarathon"); jsdom provides a
  // real localStorage. Clear it so the default (Rotterdam) pack is used.
  localStorage.clear();
});

describe("fixture: registered Rotterdam pack", () => {
  it("exposes the 16 viewing locations in course order", () => {
    expect(getMarathonLocations().map((l) => l.kilometer)).toEqual(ROTTERDAM_KMS);
  });
});

describe("calculateRunnerPredictions: locationTimes (addTime + paceToMinutes via public API)", () => {
  it("wave 1 (10:00) at pace 5:00 gives the R11 acceptance values", () => {
    const t = timesByKm(run({ wave: "1", pace: "5:00", finishTime: "" }));
    expect(t["5"]).toBe("10:25");
    expect(t["21.1"]).toBe("11:45");
    expect(t["42.195"]).toBe("13:30");
  });

  it("wave 1 at pace 5:00: full byte-identical table for every location", () => {
    const result = run({ wave: "1", pace: "5:00", finishTime: "" });
    expect(result.locationTimes.map((l) => ({ kilometer: l.kilometer, estimatedTime: l.estimatedTime }))).toEqual([
      { kilometer: 0, estimatedTime: "10:00" },
      { kilometer: 1, estimatedTime: "10:05" },
      { kilometer: 5, estimatedTime: "10:25" },
      { kilometer: 10, estimatedTime: "10:50" },
      { kilometer: 13.1, estimatedTime: "11:05" }, // 65.5 min: addTime floors seconds
      { kilometer: 18.6, estimatedTime: "11:33" },
      { kilometer: 21.1, estimatedTime: "11:45" }, // 105.5 min floored
      { kilometer: 23.7, estimatedTime: "11:58" }, // 118.5 min floored
      { kilometer: 25, estimatedTime: "12:05" },
      { kilometer: 26.7, estimatedTime: "12:13" }, // 133.5 min floored
      { kilometer: 28.2, estimatedTime: "12:21" },
      { kilometer: 30, estimatedTime: "12:30" },
      { kilometer: 35, estimatedTime: "12:55" },
      { kilometer: 36.1, estimatedTime: "13:00" }, // 180.5 min floored
      { kilometer: 40, estimatedTime: "13:20" },
      { kilometer: 42.195, estimatedTime: "13:30" }, // 210.975 min floored
    ]);
  });

  it("carries name, kilometer, description and coordinates from the pack onto each entry", () => {
    const locations = getMarathonLocations();
    const result = run({ wave: "1", pace: "5:00", finishTime: "" });
    expect(result.locationTimes).toHaveLength(locations.length);
    result.locationTimes.forEach((entry, i) => {
      expect(entry.name).toBe(locations[i].name);
      expect(entry.kilometer).toBe(locations[i].kilometer);
      expect(entry.description).toBe(locations[i].description);
      expect(entry.latitude).toBe(locations[i].latitude);
      expect(entry.longitude).toBe(locations[i].longitude);
    });
  });

  it("uses the selected wave start time (wave 3 starts 10:14)", () => {
    const t = timesByKm(run({ wave: "3", pace: "5:00", finishTime: "" }));
    expect(t["0"]).toBe("10:14");
    expect(t["5"]).toBe("10:39");
    expect(t["42.195"]).toBe("13:44");
  });

  it("paceToMinutes('5:30') = 5.5 min/km: 5 km -> 10:27, finish -> 13:52", () => {
    const t = timesByKm(run({ wave: "1", pace: "5:30", finishTime: "" }));
    expect(t["5"]).toBe("10:27"); // 27.5 min floored
    expect(t["10"]).toBe("10:55");
    expect(t["42.195"]).toBe("13:52"); // 232.07 min floored
  });

  it("paceToMinutes('5') = 5 (no-colon branch) is identical to '5:00'", () => {
    const withColon = run({ wave: "1", pace: "5:00", finishTime: "" });
    const bare = run({ wave: "1", pace: "5", finishTime: "" });
    expect(bare.locationTimes).toEqual(withColon.locationTimes);
    expect(bare.runner.pace).toBe("5");
  });

  it("addTime output format today is H:MM with zero-padded minutes (hours unpadded)", () => {
    // Every registered wave starts at or after 10:00, so a single-digit hour
    // (e.g. "9:38") is not observable through the public API today; this
    // pins the format that is observable: hours without padding, minutes
    // always two digits.
    const t = timesByKm(run({ wave: "1", pace: "5:00", finishTime: "" }));
    for (const value of Object.values(t)) {
      expect(value).toMatch(/^\d{1,2}:\d{2}$/);
    }
    expect(t["1"]).toBe("10:05");
  });
});

describe("calculateRunnerPredictions: finish time -> pace (calculatePaceFromFinishTime via public API)", () => {
  it("finishTime '3:45' with empty pace yields runner.pace '5:20'", () => {
    const result = run({ wave: "1", pace: "", finishTime: "3:45" });
    // 225 min / 42.195 km = 5.3324 min/km -> 5:20 (seconds rounded)
    expect(result.runner.pace).toBe("5:20");
  });

  it("finishTime '3:45' location times are computed from the derived 5:20 pace", () => {
    const t = timesByKm(run({ wave: "1", pace: "", finishTime: "3:45" }));
    expect(t["5"]).toBe("10:26"); // 5 * 5.3333 = 26.67 min floored
    expect(t["21.1"]).toBe("11:52"); // 112.53 min floored
    expect(t["42.195"]).toBe("13:45"); // 225.04 min floored
  });

  it("a non-empty pace wins over finishTime", () => {
    const result = run({ wave: "1", pace: "5:00", finishTime: "3:45" });
    expect(result.runner.pace).toBe("5:00");
    expect(timesByKm(result)["42.195"]).toBe("13:30");
  });

  it("finishTime without a colon is parsed as total minutes ('225' == '3:45')", () => {
    expect(run({ wave: "1", pace: "", finishTime: "225" }).runner.pace).toBe("5:20");
  });
});

describe("calculateRunnerPredictions: validation", () => {
  it("pace '16:00' (> 15 min/km) throws", () => {
    expect(() => run({ wave: "1", pace: "16:00", finishTime: "" })).toThrow(/Invalid pace value/);
  });

  it("pace '0' and unparsable pace 'abc' (paceToMinutes -> 0) throw", () => {
    expect(() => run({ wave: "1", pace: "0", finishTime: "" })).toThrow(/Invalid pace value/);
    expect(() => run({ wave: "1", pace: "abc", finishTime: "" })).toThrow(/Invalid pace value/);
  });

  it("finishTime that implies a pace above 15 min/km throws", () => {
    // 11:00 h = 660 min / 42.195 = 15.64 min/km
    expect(() => run({ wave: "1", pace: "", finishTime: "11:00" })).toThrow(/Invalid pace value/);
  });

  it("empty wave throws", () => {
    expect(() => run({ wave: "", pace: "5:00", finishTime: "" })).toThrow(/Wave must be selected/);
  });

  it("CURRENT BEHAVIOUR: empty pace AND empty finishTime does NOT throw; it falls back to the 5:30 default", () => {
    // The R11 acceptance row says "empty pace and empty finish -> throws", but
    // the unchanged code initialises effectivePace = "5:30" and only overrides
    // it when pace or finishTime is non-empty. This pins what the code does
    // today; see the T4 report for the contract discrepancy.
    const result = run({ wave: "1", pace: "", finishTime: "" });
    expect(result.runner.pace).toBe("5:30");
    expect(timesByKm(result)["42.195"]).toBe("13:52");
  });
});

describe("runnerInputSchema (shared/schema.ts): where 'both empty' is actually rejected today", () => {
  it("rejects empty pace AND empty finishTime at the form-validation layer", () => {
    const result = runnerInputSchema.safeParse({ wave: "1", pace: "", finishTime: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Either pace or finish time must be provided");
      expect(result.error.issues[0].path).toEqual(["pace"]);
    }
  });

  it("accepts a pace-only and a finishTime-only input", () => {
    expect(runnerInputSchema.safeParse({ wave: "1", pace: "5:00" }).success).toBe(true);
    expect(runnerInputSchema.safeParse({ wave: "1", finishTime: "3:45" }).success).toBe(true);
  });
});

describe("calculateRunnerPredictions: runner block", () => {
  it("keeps the provided id and name, and defaults name to 'Runner'", () => {
    const named = run({ wave: "1", pace: "5:00", finishTime: "", runnerName: "Pim" });
    expect(named.runner).toEqual({ id: "test-runner", name: "Pim", wave: "1", pace: "5:00" });

    const anonymous = calculateRunnerPredictions({ id: "x", runnerName: "", wave: "1", pace: "5:00", finishTime: "" });
    expect(anonymous.runner.name).toBe("Runner");
  });

  it("generates an id when none is provided", () => {
    const result = calculateRunnerPredictions({ runnerName: "A", wave: "1", pace: "5:00", finishTime: "" });
    expect(result.runner.id).toMatch(/^runner-\d+-[a-z0-9]+$/);
  });
});

describe("currentLocation (scheduled for removal by D8; only the deterministic part is pinned)", () => {
  it("estimatedFinish equals the 42.195 km location time", () => {
    const result = run({ wave: "1", pace: "5:00", finishTime: "" });
    expect(result.currentLocation.estimatedFinish).toBe("13:30");
    expect(result.currentLocation.estimatedFinish).toBe(timesByKm(result)["42.195"]);
    // distance / elapsedTime depend on the wall clock and are deliberately not asserted.
  });
});
