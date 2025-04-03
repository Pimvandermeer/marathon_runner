import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentMarathon } from "@/data/marathonConfig";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

export default function MarathonInfo() {
  const { t } = useLanguage();
  const marathon = getCurrentMarathon();
  
  // Format the date from YYYY-MM-DD to a more readable format
  const formattedDate = (() => {
    try {
      const date = new Date(marathon.date);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return marathon.date;
    }
  })();
  
  return (
    <div className="mb-6 p-4 bg-primary/5 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">{t("marathon.info.title")}</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Marathon basic info */}
        <div className="flex-1 space-y-2">
          <div>
            <span className="font-medium text-sm text-neutral-500">{t("marathon.info.date")}:</span>
            <p>{formattedDate}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-neutral-500">{t("marathon.info.country")}:</span>
            <p>{marathon.cityInfo.country}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-neutral-500">{t("marathon.info.timezone")}:</span>
            <p>{marathon.cityInfo.timezone}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-neutral-500">{t("marathon.info.website")}:</span>
            <a 
              href={marathon.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline mt-1"
            >
              {t("marathon.info.visitWebsite")} <ExternalLink size={14} />
            </a>
          </div>
        </div>
        
        {/* Transport information */}
        <div className="flex-1">
          <span className="font-medium text-sm text-neutral-500">{t("marathon.info.transport")}:</span>
          <p className="mt-1 text-sm">{marathon.cityInfo.transportInfo}</p>
        </div>
      </div>
      
      {/* Marathon description */}
      <div className="mt-4">
        <p className="text-sm">{marathon.description}</p>
      </div>
    </div>
  );
}