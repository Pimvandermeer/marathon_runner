import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TIP_URL } from "@/config";

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
  it("TIP_URL is the maker's own bunq.me link (pinned so a swapped link fails the build)", () => {
    expect(TIP_URL).toBe("https://bunq.me/marathonsupporter");
  });

  it("shows under the stop list when set, opening in a new tab", async () => {
    vi.doMock("@/config", () => ({ TIP_URL: "https://bunq.me/example" }));
    await renderPlan();
    const link = screen.getByRole("link", { name: "Did this help? Buy the maker a coffee" });
    expect(link.getAttribute("href")).toBe("https://bunq.me/example");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("is absent when unset", async () => {
    vi.doMock("@/config", () => ({ TIP_URL: null }));
    await renderPlan();
    expect(screen.queryByRole("link", { name: /coffee/i })).toBeNull();
  });
});
