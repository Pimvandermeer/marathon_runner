import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { MarathonPack } from "@/data/packSchema";
import { findPublishedPack, getPublishedPacks, resolveMarathon, setCurrentMarathon } from "@/data/marathonConfig";
import { decodePlan, type DecodedLink } from "@/lib/shareLink";

interface MarathonContextValue {
  /** The marathon on screen, or null when nothing is published. */
  pack: MarathonPack | null;
  published: MarathonPack[];
  selectPack: (id: string) => void;
  /** What the page URL carried when it was opened. */
  link: DecodedLink;
}

const MarathonContext = createContext<MarathonContextValue | undefined>(undefined);

function wavesFor(id: string): string[] | undefined {
  const pack = findPublishedPack(id);
  return pack ? Object.keys(pack.waveStartTimes) : undefined;
}

function initialState(search: string): { link: DecodedLink; pack: MarathonPack | null } {
  const link = decodePlan(search, wavesFor);
  // Only a link that names a PUBLISHED marathon may choose the marathon.
  const linkId = link.kind === "ok" || link.kind === "invalid-wave" || link.kind === "invalid-pace" ? link.marathonId : null;
  const resolution = resolveMarathon({ linkId });
  return { link, pack: resolution.kind === "ok" ? resolution.pack : null };
}

export function MarathonProvider({ children, search }: { children: ReactNode; search?: string }) {
  const [state, setState] = useState(() => initialState(search ?? window.location.search));
  const published = useMemo(() => getPublishedPacks(), []);

  const selectPack = useCallback((id: string) => {
    const next = published.find((p) => p.id === id);
    if (!next) return;
    setCurrentMarathon(id);
    setState((s) => ({ ...s, pack: next }));
  }, [published]);

  const value = useMemo(() => ({ pack: state.pack, published, selectPack, link: state.link }), [state, published, selectPack]);
  return <MarathonContext.Provider value={value}>{children}</MarathonContext.Provider>;
}

export function useMarathon(): MarathonContextValue {
  const ctx = useContext(MarathonContext);
  if (!ctx) throw new Error("useMarathon must be used within a MarathonProvider");
  return ctx;
}
