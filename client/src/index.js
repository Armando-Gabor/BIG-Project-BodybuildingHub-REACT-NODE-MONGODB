// Glavni ulazni modul React aplikacije
// Povezuje React s DOM-om i postavlja osnovnu strukturu aplikacije
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./i18n";

// Inicijalizacija React korijenskog elementa
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderiranje aplikacije
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
