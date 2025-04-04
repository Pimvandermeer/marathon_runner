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
  "app.title": "Marathon Supporter Tracker",
  "app.subtitle": "Help supporters track their runners",
  "app.coming_soon": "Currently configured for Rotterdam Marathon. Support for Amsterdam and other marathons coming soon!",
  "app.runner_share": "Runners: Share this tool with your supporters to help them track you during the race!",
  "app.no_runners_yet": "No Runners Added Yet",
  "app.add_runner_instruction": "Add a runner using the form to start tracking their estimated location.",
  "app.add_another_runner": "Add Another Runner",
  "app.runner_information": "Runner Information",
  "app.placeholder_name": "Enter name",
  "app.select_wave": "Select wave",
  "app.calculating": "Calculating...",
  "app.shared_runner_loaded": "Shared runner loaded",
  "app.shared_runner_loaded_desc": "Runner information has been loaded from a shared link",
  "app.shared_link_error": "Could not load shared runner",
  "app.shared_link_error_desc": "The shared link may be invalid",
  "app.timeline_calculated": "Runner timeline calculated",
  "app.timeline_calculated_desc": "Your runner's timeline has been successfully calculated.",
  "app.timeline_error": "Error",
  "app.timeline_error_desc": "Failed to calculate runner timeline: ",
  "app.tracked_runners": "Tracked Runners",
  "app.currently_tracking": "You are currently tracking",
  "app.runner": "runner",
  "app.runners": "runners",

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
  "form.select_wave_placeholder": "Select wave",
  "form.example_pace": "Example: 5:30",
  "form.example_finish": "Example: 4:30",
  "form.pace_description": "The pace you expect to maintain throughout the marathon",
  "form.finish_description": "Your target total marathon time",
  "form.enter_name": "Enter name",

  // Timeline visualization
  "timeline.title": "Timeline",
  "timeline.distance": "Distance",
  "timeline.distanceToGo": "Distance to go",
  "timeline.time": "Time",
  "timeline.estimated": "Estimated",
  "timeline.km": "km",
  "timeline.toFinish": "to finish",

  // Current status
  "status.title": "Current Status",
  "status.elapsed": "Elapsed Time",
  "status.distance": "Distance",
  "status.finishTime": "Est. Finish Time",

  // Error messages
  "error.waveRequired": "Wave must be selected",
  "error.invalidPace": "Invalid pace value. Please enter a valid pace or finish time.",
  "error.invalid_seconds": "Seconds must be between 0 and 59",
  "error.invalid_minutes": "Minutes must be between 0 and 59",
  "error.provide_pace_or_finish": "Either pace or finish time must be provided",
  "error.two_digit_seconds": "Please enter seconds as a two-digit number (e.g., 4:30 not 4:3)",
  "error.two_digit_minutes": "Please enter minutes as a two-digit number (e.g., 4:30 not 4:3)",

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
  
  // Marathon landmarks
  "landmarks.start": "Start",
  "landmarks.finish": "Finish",
  "landmarks.halfMarathon": "Half Marathon",
  "landmarks.km": "km",
  
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
  "app.title": "Marathon Supporter Tracker",
  "app.subtitle": "Help supporters hun lopers te volgen",
  "app.coming_soon": "Momenteel geconfigureerd voor Rotterdam Marathon. Ondersteuning voor Amsterdam en andere marathons komt binnenkort!",
  "app.runner_share": "Lopers: Deel deze tool met je supporters om hen te helpen je te volgen tijdens de race!",
  "app.no_runners_yet": "Nog Geen Lopers Toegevoegd",
  "app.add_runner_instruction": "Voeg een loper toe via het formulier om hun geschatte locatie te volgen.",
  "app.add_another_runner": "Voeg Nog Een Loper Toe",
  "app.runner_information": "Loper Informatie",
  "app.placeholder_name": "Voer naam in",
  "app.select_wave": "Selecteer startgolf",
  "app.calculating": "Berekenen...",
  "app.shared_runner_loaded": "Gedeelde loper geladen",
  "app.shared_runner_loaded_desc": "Lopersinformatie is geladen via een gedeelde link",
  "app.shared_link_error": "Kon gedeelde loper niet laden",
  "app.shared_link_error_desc": "De gedeelde link kan ongeldig zijn",
  "app.timeline_calculated": "Loper tijdlijn berekend",
  "app.timeline_calculated_desc": "De tijdlijn van je loper is succesvol berekend.",
  "app.timeline_error": "Fout",
  "app.timeline_error_desc": "Tijdlijn berekening mislukt: ",
  "app.tracked_runners": "Gevolgde Lopers",
  "app.currently_tracking": "Je volgt momenteel",
  "app.runner": "loper",
  "app.runners": "lopers",

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
  "form.select_wave_placeholder": "Selecteer startgolf",
  "form.example_pace": "Voorbeeld: 5:30",
  "form.example_finish": "Voorbeeld: 4:30",
  "form.pace_description": "Het tempo dat je verwacht te handhaven tijdens de marathon",
  "form.finish_description": "Je streeftijd voor de volledige marathon",
  "form.enter_name": "Voer naam in",

  // Timeline visualization
  "timeline.title": "Tijdlijn",
  "timeline.distance": "Afstand",
  "timeline.distanceToGo": "Afstand te gaan",
  "timeline.time": "Tijd",
  "timeline.estimated": "Geschat",
  "timeline.km": "km",
  "timeline.toFinish": "tot finish",

  // Current status
  "status.title": "Huidige Status",
  "status.elapsed": "Verstreken Tijd",
  "status.distance": "Afstand",
  "status.finishTime": "Geschatte Finishtijd",

  // Error messages
  "error.waveRequired": "Startgolf moet geselecteerd zijn",
  "error.invalidPace": "Ongeldige tempo waarde. Voer een geldig tempo of finishtijd in.",
  "error.invalid_seconds": "Seconden moeten tussen 0 en 59 zijn",
  "error.invalid_minutes": "Minuten moeten tussen 0 en 59 zijn",
  "error.provide_pace_or_finish": "Voer een tempo of finishtijd in",
  "error.two_digit_seconds": "Voer seconden in als een getal van twee cijfers (bijv. 4:30 niet 4:3)",
  "error.two_digit_minutes": "Voer minuten in als een getal van twee cijfers (bijv. 4:30 niet 4:3)",

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
  
  // Marathon landmarks
  "landmarks.start": "Start",
  "landmarks.finish": "Finish",
  "landmarks.halfMarathon": "Halve Marathon",
  "landmarks.km": "km",
  
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