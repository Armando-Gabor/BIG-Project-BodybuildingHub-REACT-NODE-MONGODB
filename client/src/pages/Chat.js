// Stranica za razgovor s AI trenerom
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MessageList from "../components/chat/MessageList";
import GreetingScreen from "../components/chat/GreetingScreen";
import ChatInputForm from "../components/chat/ChatInputForm";
import LoadingScreen from "../components/chat/LoadingScreen";
import { formatMessagesForAPI } from "../utils/chatUtils";

const Chat = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [input, setInput] = useState(""); // Stanje za unos korisnika
  const [messages, setMessages] = useState([]); // Stanje za pohranu poruka
  const [isProcessing, setIsProcessing] = useState(false); // Stanje za praćenje obrade poruke
  const [username, setUsername] = useState(""); // Stanje za korisničko ime
  const [isLoading, setIsLoading] = useState(true); // Stanje za učitavanje
  const [apiKey, setApiKey] = useState(""); // Stanje za API ključ
  const endOfMessagesRef = useRef(null); // Referenca za automatsko pomicanje na kraj poruka

  // Dohvaćanje korisničkih podataka i API ključa prilikom učitavanja komponente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Dohvaćanje korisničkog profila
        const profileResponse = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          console.log("User data received:", userData);
          setUsername(userData.username || t("chat.defaultUsername"));
        } else {
          console.error("Profile response not OK:", profileResponse.status);
          setUsername(t("chat.defaultUsername"));
        }

        // Dohvaćanje OpenRouter API ključa
        const keyResponse = await fetch("/api/openai/key", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (keyResponse.ok) {
          const keyData = await keyResponse.json();
          setApiKey(keyData.key);
        } else {
          console.error("API key response not OK:", keyResponse.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Automatsko pomicanje na dno chata kada se promijene poruke
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Funkcija za pomicanje na dno chata
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Funkcija za slanje poruke AI modelu
  const sendMessage = async (e) => {
    e.preventDefault();

    // Provjera uvjeta za slanje poruke
    if (!input.trim() || isProcessing || !apiKey) return;

    // Dodavanje korisničke poruke u chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      // Formatiranje poruka za API uključujući sistemsku poruku
      const formattedMessages = formatMessagesForAPI(messages, input);

      // Slanje zahtjeva na OpenRouter API
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Bodybuilding Hub",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-maverick:free", // Korišteni AI model
            messages: formattedMessages,
          }),
        }
      );

      // Provjera statusa odgovora
      const data = await response.json();
      console.log("API response:", data);

      // Provjera grešaka u odgovoru
      if (!response.ok || data.error) {
        const errorCode = data.error?.code;
        let errorMessage =
          data.error?.message ||
          (data.error
            ? JSON.stringify(data.error)
            : `API request failed with status ${response.status}`);

        if (errorCode === 429) {
          errorMessage =
            "Rate limit exceeded. Please wait a moment before sending another message.";
        }

        throw new Error(errorMessage);
      }

      // Provjera formata odgovora
      if (
        !data.choices ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0
      ) {
        throw new Error("Invalid API response format: missing choices array");
      }

      // Provjera da li je odgovor asistenta prisutan
      if (!data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid API response format: missing message content");
      }

      // Izdvajanje odgovora asistenta
      const assistantMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      // Dodavanje odgovora asistenta u chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Prikaz poruke o grešci korisniku
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${t("chat.errorMessage")} ${error.message}`,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Ako nema poruka, prikaži pozdravni ekran
  const showGreeting = messages.length === 0;

  // Prikaz učitavanja
  if (isLoading) {
    return (
      <main className="container mx-auto pt-20 px-4 flex justify-center">
        <div className="w-full max-w-2xl p-4">
          <LoadingScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto pt-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl p-4 flex flex-col h-[calc(100vh-8rem)]">
        <h2 className="text-[34px] font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          {t("chat.title")}
        </h2>

        {/* Prostor za prikaz poruka */}
        <div className="flex-grow overflow-auto mb-4 bg-gray-800/50 rounded-lg">
          {showGreeting ? (
            <GreetingScreen username={username} />
          ) : (
            <MessageList
              messages={messages}
              isProcessing={isProcessing}
              endOfMessagesRef={endOfMessagesRef}
            />
          )}
        </div>

        {/* Forma za unos poruka */}
        <ChatInputForm
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isProcessing={isProcessing}
          apiKey={apiKey}
        />
      </div>
    </main>
  );
};

export default Chat;
