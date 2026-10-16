/**
 * Cookie-free visit counting with GoatCounter, sent by hand instead of with
 * count.js: count.js always forwards location.search, and share links carry
 * the runner's name. Only the marathon id, the referring site and the screen
 * width leave the browser.
 */

const ENDPOINT = "https://cyclerunner.goatcounter.com/count";
const SITE_HOST = "marathon-supporter.com";
const MARATHON_ID = /^[a-z0-9-]{1,40}$/;

/** `/` for a plain visit, `/?marathon=<id>` for an opened share link. */
export function visitPath(search: string): string {
  const marathon = new URLSearchParams(search).get("marathon");
  return marathon && MARATHON_ID.test(marathon) ? `/?marathon=${marathon}` : "/";
}

/** The referring site without path or query, e.g. `https://www.google.com`. */
export function referrerSite(referrer: string): string {
  try {
    const url = new URL(referrer);
    return url.host ? `${url.protocol}//${url.host}` : "";
  } catch {
    return "";
  }
}

export function countUrl(search: string, referrer: string, screenWidth: number): string {
  const params = new URLSearchParams({ p: visitPath(search), r: referrerSite(referrer), s: String(screenWidth) });
  return `${ENDPOINT}?${params}`;
}

export function countVisit(): void {
  // Localhost, previews and forks stay out of the numbers.
  if (window.location.hostname !== SITE_HOST) return;
  // no-referrer: the Referer header would otherwise carry the page URL, name included.
  fetch(countUrl(window.location.search, document.referrer, window.screen.width), {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    credentials: "omit",
    referrerPolicy: "no-referrer",
  }).catch(() => {});
}
