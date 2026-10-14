import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TIP, activeTipUrl } from "@/config";

afterEach(() => {
  cleanup();
  vi.resetModules();
  vi.doUnmock("@/config");
});

async function renderPlan() {
  const { LanguageProvider } = await import("@/contexts/LanguageContext");
  const { default: PlanView } = await import("@/components/PlanView");
  const { packs } = await import("@/data/marathonConfig");
  const { calculateRunnerPredictions } = await import("@/data/staticData");
  const pack = packs[0];
  const prediction = calculateRunnerPredictions({ wave: "1", pace: "5:00", id: "t" }, pack);
  return render(
    <LanguageProvider initial="en">
      <PlanView pack={pack} runner={{ key: "k", shared: false, prediction }} onShare={() => {}} onRemove={() => {}} />
    </LanguageProvider>,
  );
}

describe("tip link", () => {
  it("is the maker's Tikkie with its expiry date (pinned so a swapped link fails the build)", () => {
    expect(TIP).toEqual({ url: "https://tikkie.me/pay/fed9c983mlgo63a47abq", expires: "2026-10-28" });
  });

  it("shows until the day before the Tikkie expires, then hides itself", () => {
    expect(activeTipUrl("2026-10-14")).toBe(TIP?.url);
    expect(activeTipUrl("2026-10-27")).toBe(TIP?.url);
    expect(activeTipUrl("2026-10-28")).toBeNull();
    expect(activeTipUrl("2027-01-01")).toBeNull();
  });

  it("appears under the stop list when active, opening in a new tab", async () => {
    vi.doMock("@/config", () => ({ activeTipUrl: () => "https://tikkie.me/pay/example" }));
    await renderPlan();
    const link = screen.getByRole("link", { name: "Did this help? Buy the maker a coffee" });
    expect(link.getAttribute("href")).toBe("https://tikkie.me/pay/example");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("is absent when expired or unset", async () => {
    vi.doMock("@/config", () => ({ activeTipUrl: () => null }));
    await renderPlan();
    expect(screen.queryByRole("link", { name: /coffee/i })).toBeNull();
  });
});
