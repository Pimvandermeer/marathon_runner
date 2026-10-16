import { describe, expect, it } from "vitest";
import { buildShareUrl, decodePlan, encodePlan, languagePath, pathLanguage } from "@/lib/shareLink";

const WAVES: Record<string, string[]> = { "amsterdam-2026": ["1", "2", "3", "4", "5", "6"] };
const wavesFor = (id: string) => WAVES[id];

describe("share link round trip", () => {
  it("decode(encode(plan)) returns the same plan", () => {
    const plan = { marathonId: "amsterdam-2026", name: "Anne & Bo", wave: "3", pace: "5:30" };
    expect(decodePlan(`?${encodePlan(plan)}`, wavesFor)).toEqual({ kind: "ok", ...plan });
  });

  it("builds an absolute URL on the current page", () => {
    const url = buildShareUrl("https://marathon-supporter.com", "/", { marathonId: "amsterdam-2026", name: "A", wave: "1", pace: "4:15" });
    expect(url).toBe("https://marathon-supporter.com/?marathon=amsterdam-2026&name=A&wave=1&pace=4%3A15");
  });

  it("points an English sharer at the page with the English link preview", () => {
    const plan = { marathonId: "amsterdam-2026", name: "A", wave: "1", pace: "4:15" };
    expect(buildShareUrl("https://marathon-supporter.com", languagePath("en"), plan)).toBe("https://marathon-supporter.com/en/?marathon=amsterdam-2026&name=A&wave=1&pace=4%3A15");
    expect(languagePath("nl")).toBe("/");
    expect([pathLanguage("/en"), pathLanguage("/en/"), pathLanguage("/"), pathLanguage("/end")]).toEqual(["en", "en", null, null]);
  });

  it("carries only the plan, never a ref or campaign tag", () => {
    const encoded = encodePlan({ marathonId: "amsterdam-2026", name: "A", wave: "1", pace: "4:15" });
    expect(Array.from(new URLSearchParams(encoded).keys())).toEqual(["marathon", "name", "wave", "pace"]);
  });

  it("a ref tag next to the plan does not break it", () => {
    expect(decodePlan("?ref=strava", wavesFor)).toEqual({ kind: "none" });
    expect(decodePlan("?ref=strava&marathon=amsterdam-2026&name=A&wave=1&pace=4:15", wavesFor)).toEqual({ kind: "ok", marathonId: "amsterdam-2026", name: "A", wave: "1", pace: "4:15" });
  });

  it("an empty name is omitted and decodes as an empty string", () => {
    const encoded = encodePlan({ marathonId: "amsterdam-2026", name: "", wave: "1", pace: "5:00" });
    expect(encoded).not.toContain("name=");
    expect(decodePlan(encoded, wavesFor)).toMatchObject({ kind: "ok", name: "" });
  });
});

describe("share link rejections (never default a marathon or a wave)", () => {
  it("a plain visit carries no plan", () => {
    expect(decodePlan("", wavesFor)).toEqual({ kind: "none" });
    expect(decodePlan("?utm_source=whatsapp", wavesFor)).toEqual({ kind: "none" });
  });

  it("a Rotterdam 2025 link (no marathon parameter) is a previous edition", () => {
    expect(decodePlan("?name=x&wave=1&pace=5:00", wavesFor)).toEqual({ kind: "previous-edition" });
  });

  it("an unpublished marathon is unknown", () => {
    expect(decodePlan("?marathon=rotterdam&wave=1&pace=5:00", wavesFor)).toEqual({ kind: "unknown-marathon", id: "rotterdam" });
  });

  it("a wave the pack does not have is rejected", () => {
    expect(decodePlan("?marathon=amsterdam-2026&wave=9&pace=5:00", wavesFor)).toMatchObject({ kind: "invalid-wave", wave: "9" });
    expect(decodePlan("?marathon=amsterdam-2026&pace=5:00", wavesFor)).toMatchObject({ kind: "invalid-wave" });
  });

  it("a malformed pace is rejected", () => {
    for (const pace of ["", "5", "5:7", "abc", "5:60"]) {
      expect(decodePlan(`?marathon=amsterdam-2026&wave=1&pace=${pace}`, wavesFor)).toMatchObject({ kind: "invalid-pace" });
    }
  });

  it("caps an oversized name", () => {
    const r = decodePlan(`?marathon=amsterdam-2026&wave=1&pace=5:00&name=${"x".repeat(500)}`, wavesFor);
    expect(r.kind === "ok" && r.name.length).toBe(60);
  });
});
