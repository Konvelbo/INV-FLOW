"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { translations, Language, TranslationKey } from "@/src/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dict: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("app_language") as Language;
      if (savedLang && (savedLang === "fr" || savedLang === "en")) {
        return savedLang;
      }
    }
    return "fr";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || translations["fr"][key] || key;
    },
    [language],
  );

  const dict = useMemo(() => translations[language], [language]);

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, dict }),
    [language, setLanguage, t, dict],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
