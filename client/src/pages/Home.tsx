import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CalendarDays, X } from "lucide-react";
import RunnerForm, { type RunnerFormValues } from "@/components/RunnerForm";
import PlanView, { type PlannedRunner } from "@/components/PlanView";
import ShareDialog from "@/components/ShareDialog";
import RaceInfo from "@/components/RaceInfo";
import CourseMap from "@/components/CourseMap";
import { useLanguage, type TranslationKey } from "@/contexts/LanguageContext";
import { useMarathon } from "@/contexts/MarathonContext";
import type { MarathonPack } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import { calculateRunnerPredictions } from "@/data/staticData";
import type { DecodedLink, SharedPlan } from "@/lib/shareLink";
import { formatRaceDate } from "@/lib/format";
import { cn } from "@/lib/utils";

let counter = 0;
const nextKey = () => `r${++counter}`;

/** A plan from a shared link, or null with the notice to show instead. */
function planFromLink(link: DecodedLink, pack: MarathonPack | null): { runner: PlannedRunner | null; notice: DecodedLink["kind"] | null } {
  if (link.kind === "none") return { runner: null, notice: null };
  if (link.kind !== "ok" || !pack) return { runner: null, notice: link.kind };
  try {
    const prediction = calculateRunnerPredictions({ wave: link.wave, pace: link.pace, runnerName: link.name, id: "shared" }, pack);
    return { runner: { key: nextKey(), shared: true, prediction }, notice: null };
  } catch {
    return { runner: null, notice: "invalid-pace" };
  }
}

const NOTICE_KEYS: Partial<Record<DecodedLink["kind"], [TranslationKey, TranslationKey]>> = {
  "previous-edition": ["notice.previous.title", "notice.previous.body"],
  "unknown-marathon": ["notice.unknown.title", "notice.unknown.body"],
  "invalid-wave": ["notice.wave.title", "notice.wave.body"],
  "invalid-pace": ["notice.pace.title", "notice.pace.body"],
};

export default function Home() {
  const { t, language } = useLanguage();
  const { pack, link } = useMarathon();
  const initial = useMemo(() => planFromLink(link, pack), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [runners, setRunners] = useState<PlannedRunner[]>(initial.runner ? [initial.runner] : []);
  const [selectedKey, setSelectedKey] = useState<string | null>(initial.runner?.key ?? null);
  const [notice, setNotice] = useState(initial.notice);
  const [sharing, setSharing] = useState<SharedPlan | null>(null);
  const planTop = useRef<HTMLDivElement>(null);

  if (!pack) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <CalendarDays className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{t("none.title")}</h1>
        <p className="mt-2 text-slate-600">{t("none.body")}</p>
      </div>
    );
  }

  const selected = runners.find((r) => r.key === selectedKey) ?? runners[runners.length - 1] ?? null;

  function addRunner(values: RunnerFormValues): string | null {
    try {
      const prediction = calculateRunnerPredictions(
        {
          wave: values.wave,
          pace: values.mode === "pace" ? values.pace : "",
          finishTime: values.mode === "finish" ? values.finishTime : "",
          runnerName: values.runnerName.trim(),
        },
        pack!,
      );
      const runner: PlannedRunner = { key: nextKey(), shared: false, prediction };
      setRunners((rs) => [...rs, runner]);
      setSelectedKey(runner.key);
      setNotice(null);
      requestAnimationFrame(() => planTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return null;
    } catch {
      return t("form.errRange");
    }
  }

  function removeRunner(key: string) {
    setRunners((rs) => rs.filter((r) => r.key !== key));
    if (selectedKey === key) setSelectedKey(null);
  }

  const noticeKeys = notice ? NOTICE_KEYS[notice] : undefined;
  const noticeWave = link.kind === "invalid-wave" ? link.wave : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {noticeKeys && (
        <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="flex-1">
            <p className="font-semibold">{t(noticeKeys[0])}</p>
            <p className="mt-1 text-sm">{t(noticeKeys[1], { wave: noticeWave })}</p>
          </div>
          <button type="button" onClick={() => setNotice(null)} aria-label="Close" className="self-start rounded p-1 hover:bg-amber-100">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div ref={planTop} className="scroll-mt-20 space-y-6">
          {selected ? (
            <>
              {runners.length > 1 && (
                <nav aria-label={t("plan.runners")} className="flex flex-wrap gap-2">
                  {runners.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSelectedKey(r.key)}
                      aria-current={r.key === selected.key}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        r.key === selected.key ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                      )}
                    >
                      {r.prediction.runner.name === "Runner" ? t("plan.runnerFallback") : r.prediction.runner.name}
                    </button>
                  ))}
                </nav>
              )}
              <PlanView
                pack={pack}
                runner={selected}
                onShare={() => setSharing({
                  marathonId: pack.id,
                  name: selected.prediction.runner.name === "Runner" ? "" : selected.prediction.runner.name,
                  wave: selected.prediction.runner.wave,
                  pace: selected.prediction.runner.pace,
                })}
                onRemove={() => removeRunner(selected.key)}
              />
            </>
          ) : (
            <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {localize(pack.name, language)} · {formatRaceDate(pack.date, language)}
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t("hero.title")}</h1>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-slate-300">{t("hero.body")}</p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {(["hero.step1", "hero.step2", "hero.step3"] as const).map((key, i) => (
                  <li key={key} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold">{i + 1}</span>
                    {t(key)}
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-xs text-slate-400">{t("brand.unofficial")}</p>
            </section>
          )}
          {!selected && <CourseMap pack={pack} className="hidden lg:block" />}
        </div>

        <div className="space-y-6">
          <section aria-labelledby="form-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="form-heading" className="mb-4 text-lg font-semibold text-slate-900">{t(runners.length ? "form.titleAnother" : "form.title")}</h2>
            <RunnerForm pack={pack} onSubmit={addRunner} />
          </section>
          {/* On the desktop intro the map sits in the main column instead */}
          <CourseMap pack={pack} className={selected ? undefined : "lg:hidden"} />
          <RaceInfo pack={pack} />
        </div>
      </div>

      <ShareDialog pack={pack} plan={sharing} onOpenChange={(open) => { if (!open) setSharing(null); }} />
    </div>
  );
}
