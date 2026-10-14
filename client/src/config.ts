import { todayIn } from "@/data/marathonConfig";

/**
 * Site-wide settings that are not race data.
 *
 * TIP: the maker's tip link and the day it stops working. A Tikkie expires,
 * so the link is hidden from `expires` onward (Amsterdam time) and supporters
 * never land on a dead page; no redeploy is needed for that. The exact values
 * are pinned in config.test.tsx, so a swapped link fails the build.
 */
export const TIP: { url: string; expires: string } | null = {
  url: "https://tikkie.me/pay/fed9c983mlgo63a47abq",
  expires: "2026-10-28",
};

/** The tip link if it is still valid today, else null. */
export function activeTipUrl(today: string = todayIn("Europe/Amsterdam")): string | null {
  return TIP && today < TIP.expires ? TIP.url : null;
}
