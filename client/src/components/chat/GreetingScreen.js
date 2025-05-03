// Komponenta za prikaz pozdravnog zaslona u chatu
// Prikazuje personalizirani pozdrav korisniku
import React from "react";
import { useTranslation } from "react-i18next";

const GreetingScreen = ({ username }) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        {/* Personalizirani pozdrav s imenom korisnika */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
          {t("chat.greeting", { username })}
        </h3>
        {/* Poruka dobrodošlice */}
        <p className="text-4xl font-bold text-gray-200">
          {t("chat.howCanIHelp")}
        </p>
      </div>
    </div>
  );
};

export default GreetingScreen;
