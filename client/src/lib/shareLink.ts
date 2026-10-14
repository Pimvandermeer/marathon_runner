/**
 * The share-link contract: the only place that writes or reads plan links.
 * A link carries the marathon id, so a supporter always sees the same
 * edition, waves and stops as the runner who shared it. Nothing is ever
 * defaulted: an old link, an unknown marathon or an unknown wave is reported
 * to the caller, which shows a notice instead of a wrong plan.
 */

export interface SharedPlan {
  marathonId: string;
  name: string;
  wave: string;
  pace: string;
}

export type DecodedLink =
  | { kind: "none" }
  | { kind: "previous-edition" }
  | { kind: "unknown-marathon"; id: string }
  | { kind: "invalid-wave"; marathonId: string; wave: string }
  | { kind: "invalid-pace"; marathonId: string }
  | ({ kind: "ok" } & SharedPlan);

const PACE = /^\d{1,2}:[0-5]\d$/;

export function encodePlan(plan: SharedPlan): string {
  const params = new URLSearchParams();
  params.set("marathon", plan.marathonId);
  if (plan.name) params.set("name", plan.name);
  params.set("wave", plan.wave);
  params.set("pace", plan.pace);
  return params.toString();
}

export function buildShareUrl(origin: string, pathname: string, plan: SharedPlan): string {
  return `${origin}${pathname}?${encodePlan(plan)}`;
}

/**
 * @param search location.search (with or without the leading "?")
 * @param wavesFor returns the wave keys of a PUBLISHED marathon, or undefined
 *   when the id is not published
 */
export function decodePlan(search: string, wavesFor: (marathonId: string) => string[] | undefined): DecodedLink {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const marathonId = params.get("marathon");
  const name = params.get("name") ?? "";
  const wave = params.get("wave");
  const pace = params.get("pace");

  if (!marathonId) {
    // Links made before marathons were encoded (Rotterdam 2025) carry plan
    // values without a marathon; a plain visit carries nothing.
    return wave || pace || params.has("name") ? { kind: "previous-edition" } : { kind: "none" };
  }

  const waves = wavesFor(marathonId);
  if (!waves) return { kind: "unknown-marathon", id: marathonId };
  if (!wave || !waves.includes(wave)) return { kind: "invalid-wave", marathonId, wave: wave ?? "" };
  if (!pace || !PACE.test(pace)) return { kind: "invalid-pace", marathonId };

  return { kind: "ok", marathonId, name: name.slice(0, 60), wave, pace };
}
