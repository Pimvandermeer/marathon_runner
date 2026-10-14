import { z } from "zod";

/**
 * Shape of a published marathon data pack (one file per edition in
 * client/src/data/marathons/). Every published pack is validated against this
 * schema at module load and in packs.test.ts, so a malformed or out-of-range
 * value fails the build instead of reaching a supporter.
 */

export const localizedSchema = z.object({
  en: z.string().min(1),
  nl: z.string().min(1),
});
export type Localized = z.infer<typeof localizedSchema>;

const httpsUrl = z.string().url().refine((u) => u.startsWith("https://"), "must be an https URL");
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD")
  .refine((d) => !Number.isNaN(Date.parse(`${d}T00:00:00Z`)), "must be a real date");
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be HH:MM");

function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const sourceSchema = z.object({
  url: httpsUrl,
  checked: isoDate,
  value: z.string().min(1),
});

export const transportTypes = ["metro", "tram", "train", "bus", "parking", "walk"] as const;
export type TransportType = (typeof transportTypes)[number];

export const viewingLocationSchema = z
  .object({
    id: z.string().min(1),
    name: localizedSchema,
    kilometer: z.number().min(0).max(42.195),
    passes: z.array(z.number().min(0).max(42.195)).min(1),
    transportType: z.enum(transportTypes),
    lines: z.array(z.string()),
    osmId: z.string().optional(),
    latitude: z.number().min(50.5).max(53.7),
    longitude: z.number().min(3.2).max(7.3),
    description: localizedSchema,
    courseSide: localizedSchema,
    crossBeforeClosures: z.boolean(),
    walkingMeters: z.number().int().min(0),
    sources: z.array(sourceSchema).min(1),
  })
  .refine((l) => l.passes.includes(l.kilometer), { message: "passes must contain kilometer" });
export type ViewingLocation = z.infer<typeof viewingLocationSchema>;

export const landmarkSchema = z.object({
  distance: z.number().min(0).max(42.195),
  name: localizedSchema,
});
export type Landmark = z.infer<typeof landmarkSchema>;

export const packSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: localizedSchema,
    displayName: localizedSchema,
    year: z.number().int(),
    date: isoDate,
    timezone: z.string().refine(isValidTimeZone, "must be an IANA time zone"),
    websiteUrl: httpsUrl,
    courseMapUrl: httpsUrl,
    // Organiser course map rendered to images in client/public (preview for the
    // page, full size for zooming), with the original as the cited source.
    routeMap: z
      .object({
        preview: z.string().regex(/^\/marathons\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|jpg|png)$/),
        full: z.string().regex(/^\/marathons\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|jpg|png)$/),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        source: httpsUrl,
      })
      .nullable(),
    description: localizedSchema,
    cityInfo: z.object({
      country: z.string(),
      transportInfo: localizedSchema,
    }),
    waveStartTimes: z.record(hhmm),
    waveLabels: z.record(localizedSchema).optional(),
    marathonLandmarks: z.array(landmarkSchema).min(2),
    viewingLocations: z.array(viewingLocationSchema).min(2),
    spectatorTips: z.object({ en: z.array(z.string().min(1)), nl: z.array(z.string().min(1)) }),
    verification: z.object({
      log: z.string(),
      readers: z.number().int().min(2),
      stopsVerified: z.number().int().min(0),
      stopsOmitted: z.number().int().min(0),
    }),
  })
  .superRefine((pack, ctx) => {
    const keys = Object.keys(pack.waveStartTimes);
    keys.forEach((k, i) => {
      if (k !== String(i + 1)) ctx.addIssue({ code: "custom", path: ["waveStartTimes"], message: `wave keys must be "1".."n" in order, got "${k}" at position ${i + 1}` });
    });
    const times = Object.values(pack.waveStartTimes);
    for (let i = 1; i < times.length; i++) {
      if (times[i] <= times[i - 1]) ctx.addIssue({ code: "custom", path: ["waveStartTimes"], message: "wave start times must be strictly ascending" });
    }
    if (pack.waveLabels) {
      for (const k of Object.keys(pack.waveLabels)) {
        if (!keys.includes(k)) ctx.addIssue({ code: "custom", path: ["waveLabels", k], message: "label for a wave that does not exist" });
      }
    }
    const isSorted = (xs: number[]) => xs.every((x, i) => i === 0 || x >= xs[i - 1]);
    if (!isSorted(pack.marathonLandmarks.map((l) => l.distance))) {
      ctx.addIssue({ code: "custom", path: ["marathonLandmarks"], message: "landmarks must be sorted by distance" });
    }
    if (!isSorted(pack.viewingLocations.map((l) => l.kilometer))) {
      ctx.addIssue({ code: "custom", path: ["viewingLocations"], message: "viewing locations must be sorted by kilometer" });
    }
    if (pack.spectatorTips.en.length !== pack.spectatorTips.nl.length) {
      ctx.addIssue({ code: "custom", path: ["spectatorTips"], message: "en and nl tip lists must have the same length" });
    }
  });

export type MarathonPack = z.infer<typeof packSchema>;
