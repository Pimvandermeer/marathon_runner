import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { availableMarathons, getCurrentMarathon, setCurrentMarathon, MarathonConfig } from '@/data/marathonConfig';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MarathonSelector() {
  const [selectedMarathon, setSelectedMarathon] = useState<MarathonConfig>(getCurrentMarathon());
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // For now, only show Rotterdam
  const rotterdamMarathon = availableMarathons.find(m => m.id === 'rotterdam');
  const visibleMarathons = rotterdamMarathon ? [rotterdamMarathon] : [];
  
  // Handle marathon selection change
  const handleMarathonChange = (marathonId: string) => {
    // For now only allow Rotterdam
    if (marathonId !== 'rotterdam') return;
    
    setCurrentMarathon(marathonId);
    const newMarathon = availableMarathons.find(m => m.id === marathonId);
    
    if (newMarathon) {
      setSelectedMarathon(newMarathon);
      
      // Show a toast notification
      toast({
        title: t("marathon.changed"),
        description: t("marathon.changedDescription").replace('{marathon}', `${newMarathon.name} ${newMarathon.year}`),
        variant: "default",
      });
      
      // Reload the page to apply all changes
      window.location.reload();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-500">{t("marathon.select")}:</span>
      <Select
        value={selectedMarathon.id}
        onValueChange={handleMarathonChange}
        disabled={visibleMarathons.length <= 1}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("marathon.selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {visibleMarathons.map(marathon => (
            <SelectItem key={marathon.id} value={marathon.id}>
              {marathon.name} {marathon.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}