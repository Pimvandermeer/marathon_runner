/**
 * Cookie-free visit counting with GoatCounter, sent by hand instead of with
 * count.js: count.js always forwards location.search, and share links carry
 * the runner's name. Only the page and marathon id, the channel tag of a ref
 * link, the referring site and the screen width leave the browser.
 */
import { pathLanguage } from "@/lib/shareLink";

const ENDPOINT = "https://cyclerunner.goatcounter.com/count";
const SITE_HOST = "marathon-supporter.com";
const MARATHON_ID = /^[a-z0-9-]{1,40}$/;
// The keys GoatCounter reads a channel or campaign from (hit.go).
const CAMPAIGN_KEYS = ["ref", "utm_source", "src", "source", "utm_campaign", "campaign"];
const CAMPAIGN_VALUE = /^[A-Za-z0-9_.-]{1,40}$/;

function isCampaignKey(key: string): boolean {
  return CAMPAIGN_KEYS.includes(key) || key.startsWith("utm_");
}

/** `/` or `/en/`, plus `?marathon=<id>` for an opened share link. */
export function visitPath(pathname: string, search: string): string {
  const page = pathLanguage(pathname) === "en" ? "/en/" : "/";
  const marathon = new URLSearchParams(search).get("marathon");
  return marathon && MARATHON_ID.test(marathon) ? `${page}?marathon=${marathon}` : page;
}

/** Only the channel and campaign tags of a ref link, e.g. `ref=strava`. */
export function campaignQuery(search: string): string {
  const params = new URLSearchParams(search);
  const kept = new URLSearchParams();
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value && CAMPAIGN_VALUE.test(value)) kept.set(key, value);
  }
  return kept.toString();
}

/** The search string without channel and campaign tags, or null when it has none. */
export function withoutCampaign(search: string): string | null {
  const params = new URLSearchParams(search);
  const keys = Array.from(params.keys()).filter(isCampaignKey);
  if (keys.length === 0) return null;
  keys.forEach((key) => params.delete(key));
  const rest = params.toString();
  return rest ? `?${rest}` : "";
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

export function countUrl(pathname: string, search: string, referrer: string, screenWidth: number): string {
  const params = new URLSearchParams({ p: visitPath(pathname, search), r: referrerSite(referrer), s: String(screenWidth) });
  const campaign = campaignQuery(search);
  if (campaign) params.set("q", campaign);
  return `${ENDPOINT}?${params}`;
}

export function countVisit(): void {
  const { pathname, search, hash } = window.location;
  // A copied address bar must not count for the channel of the original ref link.
  const rest = withoutCampaign(search);
  if (rest !== null) window.history.replaceState(window.history.state, "", pathname + rest + hash);

  // Localhost, previews and forks stay out of the numbers.
  if (window.location.hostname !== SITE_HOST) return;
  // no-referrer: the Referer header would otherwise carry the page URL, name included.
  fetch(countUrl(pathname, search, document.referrer, window.screen.width), {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    credentials: "omit",
    referrerPolicy: "no-referrer",
  }).catch(() => {});
}
