import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Layout from "@/components/Layout";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { MarathonProvider, useMarathon } from "@/contexts/MarathonContext";
import { localize } from "@/data/marathonConfig";

function DocumentTitle() {
  const { language, t } = useLanguage();
  const { pack } = useMarathon();
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = pack ? `${localize(pack.displayName, language)} | ${t("brand.name")}` : t("brand.name");
  }, [pack, language, t]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <MarathonProvider>
        <DocumentTitle />
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
        <Toaster />
      </MarathonProvider>
    </LanguageProvider>
  );
}
