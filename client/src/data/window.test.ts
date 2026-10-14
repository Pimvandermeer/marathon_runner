import { describe, expect, it } from "vitest";
import { calculateRunnerPredictions, crossingMinutes } from "@/data/staticData";
import { packs } from "@/data/marathonConfig";
import { packSchema } from "@/data/packSchema";
import rotterdam from "@/data/marathons/rotterdam.json";

const ams = packs[0];
const byKm = (r: ReturnType<typeof calculateRunnerPredictions>) =>
  Object.fromEntries(r.locationTimes.map((l) => [String(l.kilometer), [l.estimatedTime, l.latestTime]]));

describe("start-line crossing window", () => {
  it("runs until the next wave starts, and for the last wave until the organiser's 09:50", () => {
    expect(crossingMinutes(ams, "1")).toBe(2); // 09:00 -> 09:02
    expect(crossingMinutes(ams, "3")).toBe(13); // 09:11 -> 09:24
    expect(crossingMinutes(ams, "6")).toBe(7); // 09:43 -> 09:50 (startWindowEnd)
    expect(crossingMinutes(ams, "9")).toBe(0);
  });

  it("is zero for the last wave when the pack has no start-window end", () => {
    expect(crossingMinutes(rotterdam, "5")).toBe(0);
    expect(crossingMinutes(rotterdam, "1")).toBe(7);
  });

  it("shifts every stop and the finish by the crossing window; the earliest times are unchanged", () => {
    const r = calculateRunnerPredictions({ wave: "3", pace: "5:00", id: "t" }, ams);
    expect(r.crossingMinutes).toBe(13);
    expect(r.estimatedFinish).toBe("12:41");
    expect(r.latestFinish).toBe("12:54");
    expect(byKm(r)["0"]).toEqual(["9:11", "9:24"]);
    expect(byKm(r)["11.6"]).toEqual(["10:09", "10:22"]); // 11.6 km * 5 min = 58 min
  });

  it("collapses to a single time when there is no window", () => {
    const r = calculateRunnerPredictions({ wave: "5", pace: "5:00", id: "t" }, rotterdam);
    expect(r.locationTimes.every((l) => l.latestTime === l.estimatedTime)).toBe(true);
  });

  it("the schema rejects a start window that ends before the last wave starts", () => {
    expect(packSchema.safeParse({ ...structuredClone(ams), startWindowEnd: "09:40" }).success).toBe(false);
    expect(ams.startWindowEnd).toBe("09:50");
  });
});
