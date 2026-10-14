import { AlertTriangle, Bus, Footprints, MapPin, Navigation, ParkingCircle, Train, TramFront } from "lucide-react";
import { useLanguage, type TranslationKey } from "@/contexts/LanguageContext";
import type { ViewingLocation, TransportType } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import { directionsUrl, formatKm, padTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const ICONS: Record<TransportType, typeof Train> = {
  metro: Train, train: Train, tram: TramFront, bus: Bus, parking: ParkingCircle, walk: Footprints,
};

interface StopCardProps {
  stop: ViewingLocation & { estimatedTime: string };
  isLast: boolean;
}

export default function StopCard({ stop, isLast }: StopCardProps) {
  const { t, language } = useLanguage();
  const Icon = ICONS[stop.transportType] ?? MapPin;
  const isEndpoint = stop.transportType === "walk";
  const passCount = new Set(stop.passes).size;

  return (
    <li className="relative grid grid-cols-1 sm:grid-cols-[5.5rem_1fr] sm:gap-x-4">
      {/* time rail (tablet and up; on phones the time sits in the card header) */}
      <div className="relative hidden flex-col items-end pt-1 text-right sm:flex">
        <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 sm:text-2xl">{padTime(stop.estimatedTime)}</span>
        <span className="text-xs font-medium tabular-nums text-slate-500">{formatKm(stop.kilometer, language)} {t("stop.km")}</span>
      </div>

      <div className={cn("relative ml-2 border-l-2 pb-5 pl-5 sm:ml-0 sm:pb-6", isLast ? "border-transparent" : "border-slate-200")}>
        <span
          aria-hidden
          className={cn(
            "absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-white ring-2",
            isEndpoint ? "bg-brand ring-brand" : "bg-white ring-slate-300",
          )}
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-1 flex items-baseline gap-2 sm:hidden">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900">{padTime(stop.estimatedTime)}</span>
            <span className="text-xs font-medium tabular-nums text-slate-500">{formatKm(stop.kilometer, language)} {t("stop.km")}</span>
          </p>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug text-slate-900">{localize(stop.name, language)}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {t(`transport.${stop.transportType}` as TranslationKey)}
            </span>
          </div>

          {stop.lines.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">{stop.lines.join(" · ")}</p>
          )}

          <p className="mt-3 text-sm leading-relaxed text-slate-700">{localize(stop.description, language)}</p>

          {!isEndpoint && stop.walkingMeters > 0 && (
            <p className="mt-3 flex gap-2 text-sm text-slate-600">
              <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              {t("stop.walk", { m: stop.walkingMeters })}
            </p>
          )}

          <details className="group mt-2 text-sm text-slate-600">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded py-1 font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              {t("stop.side")}
              <span aria-hidden className="text-slate-400 transition-transform group-open:rotate-90">›</span>
            </summary>
            <p className="mt-1 pl-6 leading-relaxed">{localize(stop.courseSide, language)}</p>
          </details>

          {stop.crossBeforeClosures && (
            <p className="mt-3 flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("stop.cross")}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {passCount > 1 ? (
              <span className="text-xs font-medium text-brand">{t("stop.passes", { n: passCount })}</span>
            ) : <span />}
            <a
              href={directionsUrl(stop.latitude, stop.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              {t("stop.directions")}
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
