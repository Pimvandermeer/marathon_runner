import { useLanguage } from "@/contexts/LanguageContext";
import { getSpectatorTips } from "@/data/marathonConfig";
import { LightbulbIcon } from "lucide-react";

export default function SpectatorTips() {
  const { t, language } = useLanguage();
  const tips = getSpectatorTips(language);
  
  if (!tips || tips.length === 0) return null;
  
  return (
    <div className="mt-6 mb-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <LightbulbIcon size={18} className="text-yellow-500" />
        {t("tips.title")}
      </h2>
      
      <ul className="space-y-2 bg-yellow-50 p-4 rounded-lg">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-0.5">•</span>
            <span className="text-sm">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}