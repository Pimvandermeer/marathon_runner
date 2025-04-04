import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareDialogProps {
  runners: any[];
  className?: string;
}

export function ShareDialog({ runners, className }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  
  // Generate share URL for the first selected runner
  const generateShareUrl = () => {
    if (!runners || runners.length === 0) return "";
    
    // Just share the first runner for simplicity
    const runner = runners[0];
    const params = new URLSearchParams();
    
    params.set("name", runner.info.name);
    params.set("wave", runner.info.wave);
    params.set("pace", runner.info.pace);
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };
  
  const shareUrl = generateShareUrl();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: t("share.copied"),
        description: t("share.url_copied"),
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: t("share.error"),
        description: t("share.copy_failed"),
        variant: "destructive",
      });
    }
  };
  
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${t("share.whatsapp_text")}: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setOpen(false);
  };
  
  const shareOnInstagram = () => {
    // Instagram doesn't have a direct sharing URL, so we just copy to clipboard
    copyToClipboard();
    toast({
      title: t("share.instagram_copy"),
      description: t("share.instagram_instructions"),
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={cn("bg-green-600 hover:bg-green-700 text-white w-full", className)}
          disabled={!runners || runners.length === 0}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {t("share.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("share.title")}</DialogTitle>
          <DialogDescription>
            {t("share.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1"
          />
          <Button onClick={copyToClipboard} size="icon" variant="outline">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button 
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white"
          >
            <FaWhatsapp className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>
          
          <Button 
            onClick={shareOnInstagram}
            className="flex items-center justify-center bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white"
          >
            <FaInstagram className="mr-2 h-5 w-5" />
            Instagram
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          {t("share.note")}
        </div>
      </DialogContent>
    </Dialog>
  );
}