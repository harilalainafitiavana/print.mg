import { Sun, Moon, Globe, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {
  // 🔹 Charger le thème sauvegardé ou "light" par défaut
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // const [lang, setLang] = useState("fr");
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // 🔹 Appliquer le thème et le sauvegarder à chaque changement
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="p-6 bg-base-100 min-h-screen text-base-content">
      {/* Titre principal */}
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("settings.title")}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Carte Thème */}
        <div className="border p-6 rounded-2xl shadow-md bg-base-200 text-base-content transition">
          <h3 className="text-lg font-semibold mb-4">{t("settings.theme")}</h3>
          <p className="text-sm opacity-70 mb-4">
            {t("settings.chooseTheme")}
          </p>
          <div className="flex gap-4">
            {/* Clair */}
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition ${theme === "light"
                ? "bg-primary text-white"
                : "bg-base-100 text-base-content"
                }`}
            >
              <Sun className="w-5 h-5" /> {t("settings.light")}
            </button>

            {/* Sombre */}
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition ${theme === "dark"
                ? "bg-primary text-white"
                : "bg-base-100 text-base-content"
                }`}
            >
              <Moon className="w-5 h-5" /> {t("settings.dark")}
            </button>

          </div>
        </div>

        {/* Carte Langue */}
        <div className="border p-6 rounded-2xl shadow-md bg-base-200 text-base-content transition">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" /> {t("settings.language")}
          </h3>
          <p className="text-sm opacity-70 mb-4">
            {t("settings.chooseLanguage")}
          </p>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">🌐 {t("settings.chooseLanguage")}</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="mlg">🇲🇬 Malagasy</option>
          </select>
        </div>
      </div>
    </div>
  );
}
