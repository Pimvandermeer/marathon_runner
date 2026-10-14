import { Coffee, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MarathonPack, ViewingLocation } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import type { RunnerPrediction } from "@/data/staticData";
import { addMinutes, padTime, waveSwatch } from "@/lib/format";
import StopCard from "./StopCard";
import { TIP_URL } from "@/config";

export interface PlannedRunner {
  key: string;
  shared: boolean;
  prediction: RunnerPrediction<ViewingLocation>;
}

interface PlanViewProps {
  pack: MarathonPack;
  runner: PlannedRunner;
  onShare: () => void;
  onRemove: () => void;
}

export default function PlanView({ pack, runner, onShare, onRemove }: PlanViewProps) {
  const { t, language } = useLanguage();
  const { prediction } = runner;
  const wave = prediction.runner.wave;
  const label = pack.waveLabels?.[wave];
  const swatch = waveSwatch(label?.en);
  const name = prediction.runner.name === "Runner" ? t("plan.runnerFallback") : prediction.runner.name;

  return (
    <section aria-labelledby="plan-heading" className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {runner.shared && (
              <span className="mb-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">{t("plan.sharedBadge")}</span>
            )}
            <h2 id="plan-heading" className="text-2xl font-bold tracking-tight text-slate-900">{name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              {swatch && <span aria-hidden className="h-3 w-3 rounded-full ring-1 ring-slate-300" style={{ background: swatch }} />}
              {t("form.waveWord")} {wave}{label ? ` · ${localize(label, language)}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onShare} className="h-10">
              <Share2 className="mr-2 h-4 w-4" aria-hidden />
              {t("plan.share")}
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove} aria-label={t("plan.remove")} className="h-10 w-10 text-slate-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("plan.start")}</dt>
            <dd className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900">{padTime(pack.waveStartTimes[wave])}</dd>
            {prediction.crossingMinutes > 0 && (
              <dd className="px-1 text-[11px] leading-tight text-slate-500">
                {t("plan.crossing", { time: padTime(addMinutes(pack.waveStartTimes[wave], prediction.crossingMinutes)) })}
              </dd>
            )}
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("plan.pace")}</dt>
            <dd className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900">{prediction.runner.pace}<span className="ml-1 text-xs font-normal text-slate-500">/km</span></dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("plan.finish")}</dt>
            <dd className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900">
              {padTime(prediction.estimatedFinish)}
              {prediction.latestFinish !== prediction.estimatedFinish && (
                <span className="block font-mono text-sm font-medium text-slate-500">–{padTime(prediction.latestFinish)}</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">{t("plan.stopsTitle")}</h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">{t("plan.stopsBody")}</p>
        <ol className="mt-5">
          {prediction.locationTimes.map((stop, i) => (
            <StopCard key={stop.id} stop={stop} isLast={i === prediction.locationTimes.length - 1} />
          ))}
        </ol>
        {TIP_URL && (
          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-700 hover:border-slate-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Coffee className="h-4 w-4 text-brand" aria-hidden />
            {t("footer.tip")}
          </a>
        )}
      </div>
    </section>
  );
}
