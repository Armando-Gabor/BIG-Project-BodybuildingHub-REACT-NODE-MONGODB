// Konfiguracija lokalizacije (i18n) za aplikaciju
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Uvoz prijevoda za podržane jezike
import enTranslation from "./locales/en/translation.json";
import hrTranslation from "./locales/hr/translation.json";

// Definicija resursa za prijevode (hrvatski i engleski)
const resources = {
  en: {
    translation: enTranslation, // Engleski prijevodi
  },
  hr: {
    translation: hrTranslation, // Hrvatski prijevodi
  },
};

// Inicijalizacija i18n biblioteke s postavkama
i18n
  .use(initReactI18next) // Integracija s React komponentama
  .init({
    resources, // Prijevodi definirani iznad
    lng: localStorage.getItem("language") || "en", // Koristi spremljeni jezik iz lokalnog spremišta ili engleski kao zadani
    fallbackLng: "en", // Koristi engleski kao rezervni jezik ako prijevod nedostaje
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
