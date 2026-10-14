import { useState } from "react";
import { Check, Copy, Coffee, Share } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MarathonPack } from "@/data/packSchema";
import { localize } from "@/data/marathonConfig";
import { buildShareUrl, type SharedPlan } from "@/lib/shareLink";
import { TIP_URL } from "@/config";

interface ShareDialogProps {
  pack: MarathonPack;
  plan: SharedPlan | null;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ pack, plan, onOpenChange }: ShareDialogProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState<"idle" | "ok" | "failed">("idle");

  if (!plan) return null;
  const url = buildShareUrl(window.location.origin, window.location.pathname, plan);
  const raceName = localize(pack.name, language);
  const message = `${t("share.message", { name: plan.name || t("plan.runnerFallback"), race: raceName })} ${url}`;
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied("ok");
      setTimeout(() => setCopied("idle"), 2500);
    } catch {
      setCopied("failed");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: raceName, text: message, url });
    } catch {
      // user cancelled
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) setCopied("idle"); onOpenChange(open); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("share.title")}</DialogTitle>
          <DialogDescription>{t("share.body")}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="h-10 font-mono text-xs" aria-label="URL" />
          <Button type="button" variant="outline" onClick={copy} className="h-10 shrink-0">
            {copied === "ok" ? <Check className="mr-1.5 h-4 w-4 text-green-700" aria-hidden /> : <Copy className="mr-1.5 h-4 w-4" aria-hidden />}
            {copied === "ok" ? t("share.copied") : t("share.copy")}
          </Button>
        </div>
        <p className="min-h-[1.25rem] text-sm text-red-700" role="status">{copied === "failed" ? t("share.copyFailed") : ""}</p>

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="h-11 bg-[#1f8f4e] text-white hover:bg-[#187a41]">
            <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="mr-2 h-4 w-4" aria-hidden />
              {t("share.whatsapp")}
            </a>
          </Button>
          {canNativeShare ? (
            <Button type="button" variant="outline" onClick={nativeShare} className="h-11">
              <Share className="mr-2 h-4 w-4" aria-hidden />
              {t("share.more")}
            </Button>
          ) : <span />}
        </div>

        {TIP_URL && (
          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Coffee className="h-4 w-4" aria-hidden />
            {t("footer.tip")}
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
