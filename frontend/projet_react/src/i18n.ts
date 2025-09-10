import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationFR from "./locales/fr.json";
import translationEN from "./locales/en.json";
import translationMG from "./locales/mg.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: translationFR },
      en: { translation: translationEN },
      mg: { translation: translationMG },
    },
    lng: "fr",
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });

export default i18n;
