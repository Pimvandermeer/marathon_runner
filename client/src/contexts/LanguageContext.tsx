import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the available languages
export type Language = "en" | "nl";

// Define the language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const enTranslations: Record<string, string> = {
  // Page titles and general UI
  "app.title": "Marathon Tracker",
  "app.subtitle": "Help supporters track their runners",
  "app.coming_soon": "Currently configured for Rotterdam Marathon. Support for Amsterdam and other marathons coming soon!",

  // Form labels and buttons
  "form.runnerName": "Runner name",
  "form.wave": "Starting wave",
  "form.pace": "Pace (min/km)",
  "form.finishTime": "Finish time (hours:minutes)",
  "form.calculate": "Calculate",
  "form.enterPace": "Enter Pace",
  "form.enterFinishTime": "Enter Finish Time",
  "form.shareable": "Shareable Link",
  "form.share": "Share",
  "form.shareSuccess": "Link copied to clipboard!",
  "form.shareError": "Failed to copy link",

  // Timeline visualization
  "timeline.title": "Timeline",
  "timeline.distance": "Distance",
  "timeline.distanceToGo": "Distance to go",
  "timeline.time": "Time",
  "timeline.estimated": "Estimated",
  "timeline.km": "km",

  // Current status
  "status.title": "Current Status",
  "status.elapsed": "Elapsed Time",
  "status.distance": "Distance",
  "status.finishTime": "Est. Finish Time",

  // Error messages
  "error.waveRequired": "Wave must be selected",
  "error.invalidPace": "Invalid pace value. Please enter a valid pace or finish time.",

  // Footer
  "footer.developed": "Developed by",
  "footer.rights": "All rights reserved.",
  "footer.language": "Language",
  "footer.description": "A supporter tool for marathon runners. Track runners and plan where to support them throughout the race.",
  
  // Tips for supporters
  "tips.title": "Tips for Supporters",
  "tips.early": "Arrive at viewing spots 15 minutes early",
  "tips.transport": "Account for public transport delays on marathon day",
  "tips.supplies": "Bring water and snacks for your runner",
  "tips.signs": "Make brightly colored signs to stand out",
  
  // Time comparison
  "timeComparison.ahead": "Runner ahead by",
  "timeComparison.behind": "Runner behind by",
  "timeComparison.onTime": "Runner on time",
  "timeComparison.faster": "Faster than expected",
  "timeComparison.slower": "Slower than expected",
  "timeComparison.onPace": "On target pace",
  "timeComparison.expected": "Expected pace",
  "timeComparison.actual": "Actual pace",
  
  // Marathon selection
  "marathon.select": "Select Marathon",
  "marathon.selectPlaceholder": "Choose a marathon",
  "marathon.changed": "Marathon Changed",
  "marathon.changedDescription": "Switched to {marathon}. Runner information will be reset.",
  
  // Route map
  "map.title": "Marathon Route Map",
  "map.enlarge": "Enlarge map",
  "map.shrink": "Shrink map",
  "map.zoom_in": "Zoom in",
  "map.zoom_out": "Zoom out",
  "map.reset": "Reset view",
  "map.double_tap": "Double-tap to zoom",
  
  // Marathon info
  "marathon.info.title": "Marathon Information",
  "marathon.info.date": "Date",
  "marathon.info.website": "Official Website",
  "marathon.info.visitWebsite": "Visit Website",
  "marathon.info.country": "Country",
  "marathon.info.transport": "Transport Information",
  "marathon.info.timezone": "Timezone",
  
  // Share dialog
  "share.title": "Share Run",
  "share.button": "Share Run",
  "share.description": "Share this runner with friends and family to help them track the progress during the marathon.",
  "share.copied": "Link Copied",
  "share.url_copied": "The URL has been copied to your clipboard.",
  "share.error": "Error",
  "share.copy_failed": "Failed to copy URL to clipboard.",
  "share.whatsapp_text": "Check out this marathon runner timeline",
  "share.instagram_copy": "Instagram Story",
  "share.instagram_instructions": "URL copied to clipboard. Paste it in your Instagram story or bio.",
  "share.note": "Only the selected runner will be shared."
};

// Dutch translations
const nlTranslations: Record<string, string> = {
  // Page titles and general UI
  "app.title": "Marathon Volger",
  "app.subtitle": "Help supporters hun lopers te volgen",
  "app.coming_soon": "Momenteel geconfigureerd voor Rotterdam Marathon. Ondersteuning voor Amsterdam en andere marathons komt binnenkort!",

  // Form labels and buttons
  "form.runnerName": "Naam loper",
  "form.wave": "Startgolf",
  "form.pace": "Tempo (min/km)",
  "form.finishTime": "Finishtijd (uren:minuten)",
  "form.calculate": "Bereken",
  "form.enterPace": "Voer Tempo in",
  "form.enterFinishTime": "Voer Finishtijd in",
  "form.shareable": "Deelbare Link",
  "form.share": "Delen",
  "form.shareSuccess": "Link gekopieerd naar klembord!",
  "form.shareError": "Kopiëren van link mislukt",

  // Timeline visualization
  "timeline.title": "Tijdlijn",
  "timeline.distance": "Afstand",
  "timeline.distanceToGo": "Afstand te gaan",
  "timeline.time": "Tijd",
  "timeline.estimated": "Geschat",
  "timeline.km": "km",

  // Current status
  "status.title": "Huidige Status",
  "status.elapsed": "Verstreken Tijd",
  "status.distance": "Afstand",
  "status.finishTime": "Geschatte Finishtijd",

  // Error messages
  "error.waveRequired": "Startgolf moet geselecteerd zijn",
  "error.invalidPace": "Ongeldige tempo waarde. Voer een geldig tempo of finishtijd in.",

  // Footer
  "footer.developed": "Ontwikkeld door",
  "footer.rights": "Alle rechten voorbehouden.",
  "footer.language": "Taal",
  "footer.description": "Een hulpmiddel voor marathon supporters. Volg lopers en plan waar je ze kunt aanmoedigen tijdens de wedstrijd.",
  
  // Tips for supporters
  "tips.title": "Tips voor Supporters",
  "tips.early": "Kom 15 minuten eerder aan bij kijkpunten",
  "tips.transport": "Houd rekening met vertragingen in het openbaar vervoer op marathondag",
  "tips.supplies": "Neem water en snacks mee voor je loper",
  "tips.signs": "Maak felgekleurde borden om op te vallen",
  
  // Time comparison
  "timeComparison.ahead": "Loper voor op schema met",
  "timeComparison.behind": "Loper achter op schema met",
  "timeComparison.onTime": "Loper op schema",
  "timeComparison.faster": "Sneller dan verwacht",
  "timeComparison.slower": "Langzamer dan verwacht",
  "timeComparison.onPace": "Op doeltempo",
  "timeComparison.expected": "Verwacht tempo",
  "timeComparison.actual": "Werkelijk tempo",
  
  // Marathon selection
  "marathon.select": "Selecteer Marathon",
  "marathon.selectPlaceholder": "Kies een marathon",
  "marathon.changed": "Marathon Gewijzigd",
  "marathon.changedDescription": "Gewisseld naar {marathon}. Lopersinformatie wordt gereset.",
  
  // Route map
  "map.title": "Marathon Routekaart",
  "map.enlarge": "Vergroot kaart",
  "map.shrink": "Verklein kaart",
  "map.zoom_in": "Inzoomen",
  "map.zoom_out": "Uitzoomen",
  "map.reset": "Weergave resetten",
  "map.double_tap": "Dubbeltik om te zoomen",
  
  // Marathon info
  "marathon.info.title": "Marathon Informatie",
  "marathon.info.date": "Datum",
  "marathon.info.website": "Officiële Website",
  "marathon.info.visitWebsite": "Bezoek Website",
  "marathon.info.country": "Land",
  "marathon.info.transport": "Vervoersinformatie",
  "marathon.info.timezone": "Tijdzone",
  
  // Share dialog
  "share.title": "Deel Loop",
  "share.button": "Deel Loop",
  "share.description": "Deel deze loper met vrienden en familie om hen te helpen de voortgang tijdens de marathon te volgen.",
  "share.copied": "Link Gekopieerd",
  "share.url_copied": "De URL is naar je klembord gekopieerd.",
  "share.error": "Fout",
  "share.copy_failed": "Kopiëren naar klembord mislukt.",
  "share.whatsapp_text": "Bekijk deze marathon loper tijdlijn",
  "share.instagram_copy": "Instagram Story",
  "share.instagram_instructions": "URL naar klembord gekopieerd. Plak het in je Instagram story of bio.",
  "share.note": "Alleen de geselecteerde loper wordt gedeeld."
};

// Collection of all translations
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  nl: nlTranslations,
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "en"
  );

  // Update localStorage when language changes
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Translation function
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};