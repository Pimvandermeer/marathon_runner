import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { activeTipUrl } from "@/config";

export default function Footer() {
  const { t } = useLanguage();
  const tipUrl = activeTipUrl();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm text-slate-600 sm:px-6">
        <p className="max-w-prose">{t("footer.unofficial")}</p>
        {tipUrl && (
          <a href={tipUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-slate-800 hover:underline">
            <Coffee className="h-4 w-4" aria-hidden />
            {t("footer.tip")}
          </a>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          <span>
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">{t("footer.osm")}</a>
          </span>
          <a href="https://www.goatcounter.com/help/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">{t("footer.analytics")}</a>
          <a href="mailto:mail@pimvandermeer.nl" className="hover:underline">{t("footer.contact")}</a>
          <span>
            {t("footer.made")} <a href="https://pimvandermeer.nl" target="_blank" rel="noopener noreferrer" className="hover:underline">pimvandermeer.nl</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
