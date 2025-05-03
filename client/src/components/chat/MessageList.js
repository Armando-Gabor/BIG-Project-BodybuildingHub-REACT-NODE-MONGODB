// Komponenta za prikaz liste poruka u chatu
// Prikazuje izmjenu poruka između korisnika i asistenta
import React from "react";
import ReactMarkdown from "react-markdown";

const MessageList = ({ messages, isProcessing, endOfMessagesRef }) => {
  return (
    <div className="p-4 space-y-4">
      {/* Mapiranje i prikaz svih poruka u chatu */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.role === "user"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {/* Renderiranje poruka od asistenta s podrškom za Markdown */}
            {message.role === "assistant" ? (
              <div className="markdown-content">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              message.content
            )}
          </div>
        </div>
      ))}
      {/* Indikator učitavanja koji se prikazuje dok se obrađuje poruka */}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-white">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      )}
      {/* Referenca za automatsko pomicanje na kraj konverzacije */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
