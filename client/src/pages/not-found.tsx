import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const nl = language === "nl";
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="font-mono text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{nl ? "Deze pagina bestaat niet" : "This page does not exist"}</h1>
      <a href="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
        {nl ? "Naar de planner" : "Go to the planner"}
      </a>
    </div>
  );
}
