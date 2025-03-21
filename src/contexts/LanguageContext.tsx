
import { createContext, useState, useContext, ReactNode } from "react";
import { it } from "../locales/it";
import { en } from "../locales/en";

type Locale = "it" | "en";
type Translations = typeof it;

interface LanguageContextType {
  locale: Locale;
  currentLanguage?: Locale; // Added for backward compatibility
  translations: Translations;
  setLocale: (locale: Locale) => void;
}

const translations = {
  it,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("it");

  const value = {
    locale,
    currentLanguage: locale, // Add this for backward compatibility
    translations: translations[locale],
    setLocale,
  };

  return (
    <LanguageContext.Provider value={value}>
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
