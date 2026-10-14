import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { enTranslations, nlTranslations, LanguageProvider, type Language } from "@/contexts/LanguageContext";
import { MarathonProvider } from "@/contexts/MarathonContext";
import Home from "@/pages/Home";
import RunnerForm, { waveOptionText } from "@/components/RunnerForm";
import { packs } from "@/data/marathonConfig";

const ams = packs[0];

function renderHome(search: string, language: Language = "en") {
  return render(
    <LanguageProvider initial={language}>
      <MarathonProvider search={search}>
        <Home />
      </MarathonProvider>
    </LanguageProvider>,
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-14T10:00:00Z")); // planning week, before race day
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("translations", () => {
  it("Dutch and English have exactly the same keys", () => {
    expect(Object.keys(nlTranslations).sort()).toEqual(Object.keys(enTranslations).sort());
  });

  it("no Dutch string was left as the English text by accident (except names and units)", () => {
    const same = Object.keys(enTranslations).filter((k) => (enTranslations as Record<string, string>)[k] === nlTranslations[k as keyof typeof nlTranslations]);
    expect(same.sort()).toEqual(["brand.name", "footer.contact", "form.paceUnit", "plan.start", "share.whatsapp", "stop.km", "transport.bus", "transport.metro", "transport.parking", "transport.tram"].sort());
  });
});

describe("wave selector", () => {
  it("shows the organiser's colour with each wave when the pack has labels", () => {
    render(<LanguageProvider initial="en"><RunnerForm pack={ams} onSubmit={() => null} /></LanguageProvider>);
    const options = within(screen.getByLabelText("Start wave")).getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual([
      "Choose a wave",
      "Wave 1 · white · 09:00",
      "Wave 2 · yellow · 09:02",
      "Wave 3 · pink · 09:11",
      "Wave 4 · orange · 09:24",
      "Wave 5 · green · 09:34",
      "Wave 6 · blue · 09:43",
    ]);
  });

  it("falls back to number and time for a pack without labels", () => {
    expect(waveOptionText({ ...ams, waveLabels: undefined }, "3", "en", "Wave")).toBe("Wave 3 · 09:11");
    expect(waveOptionText(ams, "3", "nl", "Golf")).toBe("Golf 3 · roze · 09:11");
  });
});

describe("shared links", () => {
  it("a valid link opens the runner's plan with every stop and the finish estimate", () => {
    renderHome("?marathon=amsterdam-2026&name=Sanne&wave=3&pace=5:00");
    expect(screen.getByRole("heading", { name: "Sanne" })).toBeTruthy();
    expect(screen.getByText("Shared plan")).toBeTruthy();
    // 09:11 + 42.195 km at 5:00/km, in the summary and on the finish stop
    expect(screen.getByText("Est. finish").nextElementSibling?.textContent).toBe("12:41–12:54");
    const stops = document.querySelectorAll('section[aria-labelledby="plan-heading"] ol > li');
    expect(stops).toHaveLength(ams.viewingLocations.length);
    expect(stops[stops.length - 1].textContent).toContain("12:41");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("a Rotterdam 2025 link shows the previous-edition notice and no plan", () => {
    renderHome("?name=x&wave=1&pace=5:00");
    expect(screen.getByRole("alert").textContent).toContain("previous edition");
    expect(screen.queryByText("Shared plan")).toBeNull();
  });

  it("an unknown wave is reported, never replaced by another wave", () => {
    renderHome("?marathon=amsterdam-2026&wave=9&pace=5:00", "nl");
    expect(screen.getByRole("alert").textContent).toContain("geen golf 9");
    expect(screen.queryByText("Gedeeld plan")).toBeNull();
  });

  it("a plain visit shows the introduction and the form, no notice", () => {
    renderHome("");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("See your runner more than once");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("after race day", () => {
  it("shows that no marathon is published instead of a past edition", () => {
    vi.setSystemTime(new Date("2026-10-19T08:00:00Z"));
    renderHome("?marathon=amsterdam-2026&wave=3&pace=5:00");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("No upcoming marathon right now");
  });
});
