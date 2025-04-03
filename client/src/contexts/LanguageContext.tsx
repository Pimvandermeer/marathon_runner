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
  "footer.description": "A supporter tool for the Rotterdam Marathon 2025. Track runners and plan where to support them throughout the race.",
  
  // Tips for supporters
  "tips.title": "Tips for Supporters",
  "tips.early": "Arrive at viewing spots 15 minutes early",
  "tips.transport": "Account for public transport delays on marathon day",
  "tips.supplies": "Bring water and snacks for your runner",
  "tips.signs": "Make brightly colored signs to stand out",
};

// Dutch translations
const nlTranslations: Record<string, string> = {
  // Page titles and general UI
  "app.title": "Marathon Volger",
  "app.subtitle": "Help supporters hun lopers te volgen",

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
  "footer.description": "Een hulpmiddel voor supporters van de Rotterdam Marathon 2025. Volg lopers en plan waar je ze kunt aanmoedigen tijdens de wedstrijd.",
  
  // Tips for supporters
  "tips.title": "Tips voor Supporters",
  "tips.early": "Kom 15 minuten eerder aan bij kijkpunten",
  "tips.transport": "Houd rekening met vertragingen in het openbaar vervoer op marathondag",
  "tips.supplies": "Neem water en snacks mee voor je loper",
  "tips.signs": "Maak felgekleurde borden om op te vallen",
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