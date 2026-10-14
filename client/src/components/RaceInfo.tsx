import { ExternalLink, TramFront, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MarathonPack } from "@/data/packSchema";
import { getSpectatorTips, localize } from "@/data/marathonConfig";
import { formatRaceDate, padTime } from "@/lib/format";

export default function RaceInfo({ pack }: { pack: MarathonPack }) {
  const { t, language } = useLanguage();
  const times = Object.values(pack.waveStartTimes);
  const tips = getSpectatorTips(pack, language);

  return (
    <aside aria-labelledby="race-heading" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 id="race-heading" className="text-lg font-semibold text-slate-900">{t("race.title")}</h2>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("race.date")}</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{formatRaceDate(pack.date, language)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("race.startWindow")}</dt>
          <dd className="mt-0.5 font-mono font-medium tabular-nums text-slate-900">{padTime(times[0])}–{padTime(pack.startWindowEnd ?? times[times.length - 1])}</dd>
        </div>
      </dl>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><TramFront className="h-4 w-4 text-slate-400" aria-hidden />{t("race.transport")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{localize(pack.cityInfo.transportInfo, language)}</p>
      </div>

      {tips.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Lightbulb className="h-4 w-4 text-slate-400" aria-hidden />{t("race.tips")}</h3>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <a href={pack.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:underline">
        {t("race.website")} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    </aside>
  );
}
