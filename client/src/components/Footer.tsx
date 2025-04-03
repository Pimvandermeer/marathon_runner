import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rotterdam '25</h3>
            <p className="text-neutral-300 text-sm mb-4">
              {t("footer.description")}
            </p>
            <Button 
              variant="outline" 
              className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 flex items-center gap-2"
              onClick={() => window.location.href = 'mailto:mail@pimvandermeer.nl'}
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </Button>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; 2025 {t("footer.developed")} (<a href="https://pimvandermeer.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pimvandermeer.nl</a>) - {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
