import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "nl" : "en");
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Button
        onClick={toggleLanguage}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span>{language === "en" ? "NL" : "EN"}</span>
      </Button>
    </div>
  );
};

export default LanguageToggle;