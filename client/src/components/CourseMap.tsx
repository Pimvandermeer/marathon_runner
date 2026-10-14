import { useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MarathonPack } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import { cn } from "@/lib/utils";
import { ZoomableImage } from "./ZoomableImage";

/** The organiser's course map: a preview that opens a zoomable full-size view. */
export default function CourseMap({ pack, className }: { pack: MarathonPack; className?: string }) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const map = pack.routeMap;
  const org = localize(pack.name, language);

  if (!map) {
    return (
      <section className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", className)}>
        <h2 className="text-lg font-semibold text-slate-900">{t("race.courseMap")}</h2>
        <a href={pack.courseMapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          {t("race.courseMapLink")} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </section>
    );
  }

  return (
    <section aria-label={t("race.courseMap")} className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        aria-label={`${t("race.courseMap")}: ${t("map.enlarge")}`}
      >
        <img
          src={map.preview}
          width={map.width}
          height={map.height}
          loading="lazy"
          decoding="async"
          alt={t("race.courseMap")}
          className="block h-auto w-full bg-slate-100"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow transition-colors group-hover:bg-slate-900">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          {t("map.enlarge")}
        </span>
      </button>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        <span>{t("map.credit", { org })}</span>
        <a href={map.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-slate-700 hover:underline">
          {t("map.original")} <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[90vh] max-w-5xl gap-0 p-2 sm:p-3">
          <DialogTitle className="sr-only">{t("race.courseMap")}</DialogTitle>
          {open && <ZoomableImage src={map.full} alt={t("race.courseMap")} className="h-full w-full" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
