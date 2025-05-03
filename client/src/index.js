// Glavni ulazni modul React aplikacije
// Povezuje React s DOM-om i postavlja osnovnu strukturu aplikacije
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./i18n";

// Inicijalizacija React korijenskog elementa
// Stvara korijenske instance React aplikacije u HTML elementu s ID-om "root"
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderiranje aplikacije unutar StrictMode okruženja
// StrictMode pomaže u identifikaciji potencijalnih problema u aplikaciji
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true, // Koristi nove React tranzicije
        v7_relativeSplatPath: true, // Omogućuje relativne putanje
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
