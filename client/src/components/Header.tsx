import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMarathon } from "@/contexts/MarathonContext";
import { localize } from "@/data/marathonConfig";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { pack, published, selectPack } = useMarathon();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex min-w-0 items-center gap-2.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-sm font-black text-white">42</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight text-slate-900">{t("brand.name")}</span>
            <span className="block truncate text-xs leading-tight text-slate-500">{pack ? localize(pack.name, language) : t("brand.tagline")}</span>
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-2">
          {published.length > 1 && pack && (
            <select
              aria-label="Marathon"
              value={pack.id}
              onChange={(e) => selectPack(e.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
            >
              {published.map((p) => <option key={p.id} value={p.id}>{localize(p.name, language)} {p.year}</option>)}
            </select>
          )}
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "nl" : "en")}
            aria-label={t("lang.switch")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Globe className="h-4 w-4" aria-hidden />
            {t("lang.short")}
          </button>
        </div>
      </div>
    </header>
  );
}
