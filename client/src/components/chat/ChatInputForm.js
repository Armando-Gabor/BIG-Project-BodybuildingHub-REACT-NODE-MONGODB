// Komponenta za unos poruka u chat
// Omogućuje korisniku unos teksta i slanje poruka AI treneru
import React from "react";
import { useTranslation } from "react-i18next";

const ChatInputForm = ({
  input,
  setInput,
  sendMessage,
  isProcessing,
  apiKey,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <form onSubmit={sendMessage} className="flex gap-2">
      {/* Polje za unos teksta poruke */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("chat.inputPlaceholder")}
        className="flex-grow p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        disabled={isProcessing || !apiKey}
      />
      {/* Gumb za slanje poruke */}
      <button
        type="submit"
        disabled={isProcessing || !input.trim() || !apiKey}
        className={`px-4 py-3 rounded-lg ${
          isProcessing || !input.trim() || !apiKey
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
        } text-white font-bold cursor-pointer transition-colors`}
      >
        {t("chat.send")}
      </button>
    </form>
  );
};

export default ChatInputForm;
