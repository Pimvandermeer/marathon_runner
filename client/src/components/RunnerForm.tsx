import { useId, useState, type FormEvent } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MarathonPack } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import { CLOCK, formatClockInput, padTime, waveSwatch } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RunnerFormValues {
  wave: string;
  mode: "pace" | "finish";
  pace: string;
  finishTime: string;
  runnerName: string;
}

interface RunnerFormProps {
  pack: MarathonPack;
  onSubmit: (values: RunnerFormValues) => string | null; // returns an error message or null
  compact?: boolean;
}

/** Option text for the native wave picker: "Wave 3 · pink · 09:11". */
export function waveOptionText(pack: MarathonPack, wave: string, language: "en" | "nl", waveWord: string): string {
  const label = pack.waveLabels?.[wave];
  const time = padTime(pack.waveStartTimes[wave]);
  return label ? `${waveWord} ${wave} · ${localize(label, language)} · ${time}` : `${waveWord} ${wave} · ${time}`;
}

export default function RunnerForm({ pack, onSubmit, compact = false }: RunnerFormProps) {
  const { t, language } = useLanguage();
  const ids = useId();
  const [values, setValues] = useState<RunnerFormValues>({ wave: "", mode: "pace", pace: "", finishTime: "", runnerName: "" });
  const [errors, setErrors] = useState<Partial<Record<"wave" | "time" | "form", string>>>({});

  const waves = Object.keys(pack.waveStartTimes);
  const swatch = waveSwatch(values.wave ? pack.waveLabels?.[values.wave]?.en : undefined);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!values.wave) next.wave = t("form.errWave");
    const time = values.mode === "pace" ? values.pace : values.finishTime;
    if (!CLOCK.test(time)) next.time = t(values.mode === "pace" ? "form.errPace" : "form.errFinish");
    setErrors(next);
    if (Object.keys(next).length) return;
    const failure = onSubmit(values);
    if (failure) setErrors({ form: failure });
    else setValues((v) => ({ ...v, runnerName: "" }));
  }

  const timeId = `${ids}-time`;
  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-label={t("form.title")}>
      <div className="space-y-1.5">
        <label htmlFor={`${ids}-wave`} className="text-sm font-medium text-slate-900">{t("form.wave")}</label>
        <div className="relative">
          {swatch && (
            <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ring-1 ring-slate-300" style={{ background: swatch }} />
          )}
          <select
            id={`${ids}-wave`}
            value={values.wave}
            onChange={(e) => setValues({ ...values, wave: e.target.value })}
            aria-invalid={!!errors.wave}
            aria-describedby={`${ids}-wave-help`}
            className={cn(
              "h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white pr-9 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand",
              swatch ? "pl-8" : "pl-3",
              errors.wave && "border-red-600",
            )}
          >
            <option value="" disabled>{t("form.wavePlaceholder")}</option>
            {waves.map((w) => (
              <option key={w} value={w}>{waveOptionText(pack, w, language, t("form.waveWord"))}</option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
        </div>
        <p id={`${ids}-wave-help`} className={cn("text-xs", errors.wave ? "text-red-700" : "text-slate-500")}>{errors.wave ?? t("form.waveHelp")}</p>
      </div>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium text-slate-900">{t("form.mode")}</legend>
        <div role="radiogroup" className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          {(["pace", "finish"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={values.mode === mode}
              onClick={() => { setValues({ ...values, mode }); setErrors({}); }}
              className={cn(
                "h-9 rounded-md text-sm font-medium transition-colors",
                values.mode === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
              )}
            >
              {t(mode === "pace" ? "form.byPace" : "form.byFinish")}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor={timeId} className="text-sm font-medium text-slate-900">{t(values.mode === "pace" ? "form.pace" : "form.finish")}</label>
        <div className="relative">
          <Input
            id={timeId}
            inputMode="numeric"
            autoComplete="off"
            placeholder={values.mode === "pace" ? "5:30" : "3:45"}
            value={values.mode === "pace" ? values.pace : values.finishTime}
            onChange={(e) => {
              const v = formatClockInput(e.target.value);
              setValues(values.mode === "pace" ? { ...values, pace: v } : { ...values, finishTime: v });
            }}
            aria-invalid={!!errors.time}
            aria-describedby={`${timeId}-help`}
            className={cn("h-11 pr-16 font-mono text-base tabular-nums", errors.time && "border-red-600")}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {t(values.mode === "pace" ? "form.paceUnit" : "form.finishUnit")}
          </span>
        </div>
        <p id={`${timeId}-help`} className={cn("text-xs", errors.time ? "text-red-700" : "text-slate-500")}>
          {errors.time ?? t(values.mode === "pace" ? "form.paceHelp" : "form.finishHelp")}
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${ids}-name`} className="text-sm font-medium text-slate-900">{t("form.name")}</label>
        <Input
          id={`${ids}-name`}
          maxLength={60}
          placeholder={t("form.namePlaceholder")}
          value={values.runnerName}
          onChange={(e) => setValues({ ...values, runnerName: e.target.value })}
          className="h-11 text-base"
        />
      </div>

      {errors.form && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{errors.form}</p>}

      <Button type="submit" className={cn("h-11 w-full text-base", compact && "h-10")}>
        <Clock className="mr-2 h-4 w-4" aria-hidden />
        {t("form.submit")}
      </Button>
    </form>
  );
}
