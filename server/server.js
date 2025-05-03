// Glavni poslužiteljski modul aplikacije - učitavanje konfiguracije iz .env datoteke
require("dotenv").config();

// Uvoz potrebnih modula i biblioteka
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

// Inicijalizacija Express aplikacije - osnovni objekt za izgradnju web servera
const app = express();

// Konfiguracija porta za server - prioritet ima env varijabla, a ako nije definirana koristi se 5000
const port = process.env.PORT || 5000;

// Konfiguracija middleware komponenti
// JSON middleware - omogućuje čitanje i parsiranje JSON tijela zahtjeva
// Limit od 50MB je postavljen zbog mogućnosti učitavanja slika i većih podataka
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS middleware - omogućuje dijeljenje resursa između različitih domena
// Ovo je ključno za komunikaciju između React frontend-a i Express backend-a
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Dozvoljava zahtjeve samo s frontend domene
  })
);

// Registracija svih API ruta pod zajedničkim prefiksom '/api'
// Ovaj pristup organizira sve API endpointe i olakšava njihovo upravljanje
app.use("/api", routes);

// Middleware za obradu nepostojećih ruta (404 greške)
// Aktivira se kad ne postoji ruta koja odgovara zahtjevu korisnika
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`); // Bilježi pokušaje pristupa nepostojećim rutama
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Globalni error handler middleware - centralizirana obrada svih grešaka u aplikaciji
// Hvata sve neobrađene iznimke i vraća odgovarajući HTTP status i poruku
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Ako greška nema status kod, pretpostavlja se 500 (Server Error)

  // Bilježenje detalja o grešci u sustav
  console.error("Server error:", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    error: err.stack,
  });

  // Slanje strukturiranog odgovora klijentu s opisom greške
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Pokretanje Express servera na konfiguriranom portu
// Inicira osluškivanje HTTP zahtjeva na zadanom portu
app.listen(port, () => {
  // Ispis informacija o pokrenutom serveru u konzolu
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode`
  );
  // Ispis podataka o serveru u konzolu - port i API
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api`);
});
