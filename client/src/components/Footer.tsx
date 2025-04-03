import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rotterdam '25</h3>
            <p className="text-neutral-300 text-sm">
              {t("footer.description")}
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; 2025 {t("footer.developed")} (<a href="https://pimvandermeer.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pimvandermeer.nl</a>) - {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
