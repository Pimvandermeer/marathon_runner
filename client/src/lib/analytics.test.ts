import { describe, expect, it } from "vitest";
import { countUrl, referrerSite, visitPath } from "@/lib/analytics";

describe("visit counting", () => {
  it("never sends the runner's name, wave or pace", () => {
    const url = countUrl("?marathon=amsterdam-2026&name=Jan%20Jansen&wave=A&pace=5:30", "", 390);
    expect(url).not.toMatch(/Jan|name|wave|pace|5%3A30/);
    expect(Object.fromEntries(new URL(url).searchParams)).toEqual({ p: "/?marathon=amsterdam-2026", r: "", s: "390" });
  });

  it("counts a plain visit, an old link and a malformed marathon id as /", () => {
    expect(visitPath("")).toBe("/");
    expect(visitPath("?name=Jan&wave=A&pace=5:30")).toBe("/");
    expect(visitPath("?marathon=%3Cb%3EJan%3C%2Fb%3E")).toBe("/");
  });

  it("keeps only the referring site", () => {
    expect(referrerSite("https://www.google.com/search?q=jan+jansen+marathon")).toBe("https://www.google.com");
    expect(referrerSite("android-app://com.whatsapp/")).toBe("android-app://com.whatsapp");
    expect(referrerSite("")).toBe("");
  });
});
