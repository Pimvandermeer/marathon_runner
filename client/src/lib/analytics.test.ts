import { describe, expect, it } from "vitest";
import { campaignQuery, countUrl, referrerSite, visitPath, withoutCampaign } from "@/lib/analytics";

function sent(url: string) {
  return Object.fromEntries(new URL(url).searchParams);
}

describe("visit counting", () => {
  it("never sends the runner's name, wave or pace", () => {
    const url = countUrl("/", "?marathon=amsterdam-2026&name=Jan%20Jansen&wave=A&pace=5:30", "", 390);
    expect(url).not.toMatch(/Jan|name|wave|pace|5%3A30/);
    expect(sent(url)).toEqual({ p: "/?marathon=amsterdam-2026", r: "", s: "390" });
  });

  it("counts a plain visit, an old link and a malformed marathon id as the page alone", () => {
    expect(visitPath("/", "")).toBe("/");
    expect(visitPath("/", "?name=Jan&wave=A&pace=5:30")).toBe("/");
    expect(visitPath("/", "?marathon=%3Cb%3EJan%3C%2Fb%3E")).toBe("/");
  });

  it("tells the English page apart", () => {
    expect(visitPath("/en/", "")).toBe("/en/");
    expect(visitPath("/en", "?marathon=amsterdam-2026&name=Jan")).toBe("/en/?marathon=amsterdam-2026");
    expect(visitPath("/en/elsewhere", "")).toBe("/");
  });

  it("keeps only the referring site", () => {
    expect(referrerSite("https://www.google.com/search?q=jan+jansen+marathon")).toBe("https://www.google.com");
    expect(referrerSite("android-app://com.whatsapp/")).toBe("android-app://com.whatsapp");
    expect(referrerSite("")).toBe("");
  });
});

describe("ref links", () => {
  it("send the channel tag to GoatCounter and nothing else from the query", () => {
    expect(sent(countUrl("/", "?ref=strava", "", 390))).toEqual({ p: "/", r: "", s: "390", q: "ref=strava" });
    expect(sent(countUrl("/", "?ref=strava&marathon=amsterdam-2026&name=Jan&wave=A&pace=5:30", "", 390)).q).toBe("ref=strava");
    expect(campaignQuery("?utm_source=ig&utm_campaign=amsterdam-2026&utm_medium=story")).toBe("utm_source=ig&utm_campaign=amsterdam-2026");
  });

  it("drop a tag that is not a plain channel name", () => {
    expect(campaignQuery("?ref=Jan%20Jansen")).toBe("");
    expect(sent(countUrl("/", "?ref=Jan%20Jansen", "", 390))).not.toHaveProperty("q");
  });

  it("are stripped from the address bar, leaving the plan", () => {
    expect(withoutCampaign("?ref=strava")).toBe("");
    expect(withoutCampaign("?ref=strava&marathon=amsterdam-2026&name=Jan&wave=A&pace=5:30")).toBe("?marathon=amsterdam-2026&name=Jan&wave=A&pace=5%3A30");
    expect(withoutCampaign("?utm_medium=story&utm_content=x")).toBe("");
    expect(withoutCampaign("?marathon=amsterdam-2026&name=Jan")).toBeNull();
  });
});
