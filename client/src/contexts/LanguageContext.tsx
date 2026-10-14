import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { safeStorage } from "@/lib/safeStorage";

export type Language = "en" | "nl";

export const enTranslations = {
  "brand.name": "Marathon Supporter",
  "brand.tagline": "Plan where to cheer",
  "brand.unofficial": "Unofficial supporter planner",
  "lang.switch": "Nederlands",
  "lang.short": "NL",

  "hero.title": "See your runner more than once",
  "hero.body": "Enter the runner's start wave and target pace. You get the time they pass every metro, tram and train stop along the course, and a link to share with the people cheering.",
  "hero.step1": "Pick the start wave",
  "hero.step2": "Enter pace or finish time",
  "hero.step3": "Share the plan",

  "form.title": "Runner",
  "form.titleAnother": "Add another runner",
  "form.wave": "Start wave",
  "form.wavePlaceholder": "Choose a wave",
  "form.waveHelp": "Printed on the bib and in the organiser's start e-mail.",
  "form.waveWord": "Wave",
  "form.mode": "Plan by",
  "form.byPace": "Pace",
  "form.byFinish": "Finish time",
  "form.pace": "Target pace",
  "form.paceUnit": "min/km",
  "form.paceHelp": "Average pace for the whole race, e.g. 5:30.",
  "form.finish": "Target finish time",
  "form.finishUnit": "h:mm",
  "form.finishHelp": "Net time from crossing the start line, e.g. 3:45.",
  "form.name": "Name",
  "form.namePlaceholder": "Optional, e.g. Sanne",
  "form.submit": "Show where to stand",
  "form.errWave": "Choose a start wave.",
  "form.errPace": "Enter a pace as m:ss, e.g. 5:30.",
  "form.errFinish": "Enter a finish time as h:mm, e.g. 3:45.",
  "form.errRange": "That pace is outside 2:30 to 15:00 per km. Check the numbers.",

  "plan.runnerFallback": "Runner",
  "plan.sharedBadge": "Shared plan",
  "plan.start": "Start",
  "plan.pace": "Pace",
  "plan.finish": "Est. finish",
  "plan.share": "Share plan",
  "plan.remove": "Remove",
  "plan.stopsTitle": "Where and when to stand",
  "plan.stopsBody": "Times assume an even pace from the wave start. Arrive 15 minutes early: runners spread out and the crowd is deep.",
  "plan.runners": "Runners",
  "plan.empty.title": "Your plan appears here",
  "plan.empty.body": "Fill in the runner's wave and pace to see every viewing spot with a passing time.",

  "stop.km": "km",
  "stop.passes": "Runners pass this stop {n} times",
  "stop.walk": "{m} m walk to the course",
  "stop.cross": "Cross the course before road closures start",
  "stop.directions": "Directions",
  "stop.side": "Which side of the road",
  "stop.startFinish": "Start and finish",
  "transport.metro": "Metro",
  "transport.tram": "Tram",
  "transport.train": "Train",
  "transport.bus": "Bus",
  "transport.parking": "P+R",
  "transport.walk": "On foot",

  "share.title": "Share this plan",
  "share.body": "Supporters open the link and see the same stops and times. Nothing is stored about you or the runner.",
  "share.copy": "Copy link",
  "share.copied": "Link copied",
  "share.copyFailed": "Could not copy. Select the link and copy it by hand.",
  "share.whatsapp": "WhatsApp",
  "share.more": "More apps",
  "share.message": "Where to cheer for {name} at the {race}:",

  "notice.previous.title": "This link is from a previous edition",
  "notice.previous.body": "Links made before this marathon was added cannot be opened. Ask the runner for a new link, or make a plan below.",
  "notice.unknown.title": "This marathon is not available",
  "notice.unknown.body": "The link points to a marathon that is not published here. Check the link, or make a plan for the race shown below.",
  "notice.wave.title": "The wave in this link does not exist",
  "notice.wave.body": "This marathon has no wave {wave}. Ask the runner for a new link, or enter the wave below.",
  "notice.pace.title": "The pace in this link is not readable",
  "notice.pace.body": "Ask the runner for a new link, or enter the pace below.",

  "race.title": "Race day",
  "race.date": "Date",
  "race.startWindow": "Wave starts",
  "race.courseMap": "Official course map",
  "race.courseMapLink": "Open on the organiser's site",
  "race.transport": "Getting around",
  "race.tips": "Supporter tips",
  "race.website": "Official race website",
  "map.zoom_in": "Zoom in",
  "map.zoom_out": "Zoom out",
  "map.double_tap": "Double-tap or pinch to zoom",
  "map.reset": "Reset zoom",
  "map.enlarge": "Tap to enlarge",
  "map.credit": "Course map: {org}",
  "map.original": "Original (PDF)",

  "none.title": "No upcoming marathon right now",
  "none.body": "The planner covers races whose start waves and course have been checked against the organiser. The next race appears here once it is verified.",

  "footer.unofficial": "Unofficial planner, not affiliated with the race organiser. Always check the organiser's site for changes on race day.",
  "footer.osm": "Stop locations © OpenStreetMap contributors",
  "footer.contact": "Contact",
  "footer.tip": "Did this help? Buy the maker a coffee",
  "footer.made": "Made by",
} as const;

export type TranslationKey = keyof typeof enTranslations;

export const nlTranslations: Record<TranslationKey, string> = {
  "brand.name": "Marathon Supporter",
  "brand.tagline": "Plan waar je aanmoedigt",
  "brand.unofficial": "Onofficiële supportersplanner",
  "lang.switch": "English",
  "lang.short": "EN",

  "hero.title": "Zie je loper vaker dan één keer",
  "hero.body": "Vul de startgolf en het streeftempo van je loper in. Je ziet hoe laat de loper langs elke metro-, tram- en treinhalte op het parcours komt, en krijgt een link om te delen met wie komt aanmoedigen.",
  "hero.step1": "Kies de startgolf",
  "hero.step2": "Vul tempo of eindtijd in",
  "hero.step3": "Deel het plan",

  "form.title": "Loper",
  "form.titleAnother": "Nog een loper toevoegen",
  "form.wave": "Startgolf",
  "form.wavePlaceholder": "Kies een golf",
  "form.waveHelp": "Staat op het startnummer en in de startmail van de organisatie.",
  "form.waveWord": "Golf",
  "form.mode": "Plannen op",
  "form.byPace": "Tempo",
  "form.byFinish": "Eindtijd",
  "form.pace": "Streeftempo",
  "form.paceUnit": "min/km",
  "form.paceHelp": "Gemiddeld tempo over de hele race, bijv. 5:30.",
  "form.finish": "Streefeindtijd",
  "form.finishUnit": "u:mm",
  "form.finishHelp": "Netto tijd vanaf de startlijn, bijv. 3:45.",
  "form.name": "Naam",
  "form.namePlaceholder": "Optioneel, bijv. Sanne",
  "form.submit": "Laat zien waar je moet staan",
  "form.errWave": "Kies een startgolf.",
  "form.errPace": "Vul een tempo in als m:ss, bijv. 5:30.",
  "form.errFinish": "Vul een eindtijd in als u:mm, bijv. 3:45.",
  "form.errRange": "Dat tempo ligt buiten 2:30 tot 15:00 per km. Controleer de getallen.",

  "plan.runnerFallback": "Loper",
  "plan.sharedBadge": "Gedeeld plan",
  "plan.start": "Start",
  "plan.pace": "Tempo",
  "plan.finish": "Verw. finish",
  "plan.share": "Plan delen",
  "plan.remove": "Verwijderen",
  "plan.stopsTitle": "Waar en wanneer je moet staan",
  "plan.stopsBody": "Tijden gaan uit van een gelijkmatig tempo vanaf de golfstart. Wees er 15 minuten eerder: lopers waaieren uit en het is druk langs de kant.",
  "plan.runners": "Lopers",
  "plan.empty.title": "Hier verschijnt je plan",
  "plan.empty.body": "Vul de startgolf en het tempo van je loper in om elke kijkplek met doorkomsttijd te zien.",

  "stop.km": "km",
  "stop.passes": "Lopers komen hier {n} keer langs",
  "stop.walk": "{m} m lopen naar het parcours",
  "stop.cross": "Steek het parcours over voordat de afsluitingen ingaan",
  "stop.directions": "Route",
  "stop.side": "Aan welke kant van de weg",
  "stop.startFinish": "Start en finish",
  "transport.metro": "Metro",
  "transport.tram": "Tram",
  "transport.train": "Trein",
  "transport.bus": "Bus",
  "transport.parking": "P+R",
  "transport.walk": "Te voet",

  "share.title": "Deel dit plan",
  "share.body": "Supporters openen de link en zien dezelfde haltes en tijden. Er wordt niets over jou of de loper opgeslagen.",
  "share.copy": "Link kopiëren",
  "share.copied": "Link gekopieerd",
  "share.copyFailed": "Kopiëren lukte niet. Selecteer de link en kopieer hem zelf.",
  "share.whatsapp": "WhatsApp",
  "share.more": "Andere apps",
  "share.message": "Waar je {name} kunt aanmoedigen tijdens de {race}:",

  "notice.previous.title": "Deze link is van een vorige editie",
  "notice.previous.body": "Links van vóór deze marathon kunnen niet meer worden geopend. Vraag de loper om een nieuwe link, of maak hieronder een plan.",
  "notice.unknown.title": "Deze marathon is niet beschikbaar",
  "notice.unknown.body": "De link verwijst naar een marathon die hier niet staat. Controleer de link, of maak een plan voor de race hieronder.",
  "notice.wave.title": "De golf in deze link bestaat niet",
  "notice.wave.body": "Deze marathon heeft geen golf {wave}. Vraag de loper om een nieuwe link, of vul de golf hieronder in.",
  "notice.pace.title": "Het tempo in deze link is onleesbaar",
  "notice.pace.body": "Vraag de loper om een nieuwe link, of vul het tempo hieronder in.",

  "race.title": "Racedag",
  "race.date": "Datum",
  "race.startWindow": "Golfstarts",
  "race.courseMap": "Officiële parcourskaart",
  "race.courseMapLink": "Openen op de site van de organisatie",
  "race.transport": "Onderweg",
  "race.tips": "Tips voor supporters",
  "race.website": "Officiële racewebsite",
  "map.zoom_in": "Inzoomen",
  "map.zoom_out": "Uitzoomen",
  "map.double_tap": "Dubbeltik of knijp om te zoomen",
  "map.reset": "Zoom herstellen",
  "map.enlarge": "Tik om te vergroten",
  "map.credit": "Parcourskaart: {org}",
  "map.original": "Origineel (pdf)",

  "none.title": "Er staat nu geen marathon gepland",
  "none.body": "De planner toont races waarvan de startgolven en het parcours zijn gecontroleerd bij de organisatie. De volgende race verschijnt hier zodra die is gecontroleerd.",

  "footer.unofficial": "Onofficiële planner, niet verbonden aan de organisatie van de race. Kijk op de racedag altijd op de site van de organisatie voor wijzigingen.",
  "footer.osm": "Haltelocaties © OpenStreetMap-bijdragers",
  "footer.contact": "Contact",
  "footer.tip": "Heb je hier iets aan gehad? Trakteer de maker op koffie",
  "footer.made": "Gemaakt door",
};

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en: enTranslations, nl: nlTranslations };

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Translate a key; `{name}` placeholders are filled from vars. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function initialLanguage(): Language {
  const stored = safeStorage.getItem("language");
  if (stored === "en" || stored === "nl") return stored;
  try {
    return navigator.language?.toLowerCase().startsWith("nl") ? "nl" : "en";
  } catch {
    return "en";
  }
}

export function translate(language: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  const template = dictionaries[language][key] ?? key;
  return vars ? template.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? `{${v}}`)) : template;
}

export const LanguageProvider: React.FC<{ children: ReactNode; initial?: Language }> = ({ children, initial }) => {
  const [language, setLanguageState] = useState<Language>(() => initial ?? initialLanguage());

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    safeStorage.setItem("language", next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo<LanguageContextType>(
    () => ({ language, setLanguage, t: (key, vars) => translate(language, key, vars) }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
