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
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const detectLanguage = async () => {
      // Load saved language on mount to avoid hydration mismatch
      const savedLang = localStorage.getItem("app_language") as Language;
      if (savedLang && (savedLang === "fr" || savedLang === "en")) {
        setLanguageState(savedLang);
        return;
      }

      let detectedLocale: string | undefined;

      // 1. Try Electron API if available
      const electronAPI = (window as any).electronAPI;
      if (electronAPI?.getLocale) {
        try {
          detectedLocale = await electronAPI.getLocale();
        } catch (e) {
          console.error("Failed to get locale from Electron:", e);
        }
      }

      // 2. Fallback to Browser navigator
      if (!detectedLocale) {
        detectedLocale = navigator.language;
      }

      // 3. Map to supported languages (FR by default, as requested)
      if (detectedLocale?.toLowerCase().startsWith("en")) {
        setLanguageState("en");
      } else {
        setLanguageState("fr");
      }
    };

    detectLanguage();
  }, []);

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
      const currentDict = translations[language] as any;
      const frDict = translations["fr"] as any;
      return currentDict[key] || frDict[key] || key;
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
