// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import mlg from "./locales/mlg.json";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    mlg: { translation: mlg },
  },
  lng: "fr", // langue par défaut
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
