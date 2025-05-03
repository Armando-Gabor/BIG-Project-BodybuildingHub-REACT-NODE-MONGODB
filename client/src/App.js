// Glavna React komponenta aplikacije
// Definira strukturu aplikacije i konfiguraciju ruta
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Progress from "./pages/Progress";
import Calculators from "./pages/Calculators";
import Diet from "./pages/Diet";
import Workouts from "./pages/Workouts";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";

function App() {
  return (
    // Glavni kontejner aplikacije s pozadinskim gradijentom i osnovnim stilovima
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-sans text-gray-100">
      {/* Navigacijska traka prikazana na svim stranicama */}
      <Navbar />

      {/* Definicija ruta aplikacije */}
      <Routes>
        {/* Početna stranica - dostupna svima */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* Stranica za prijavu - dostupna samo neprijavljenim korisnicima */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Stranica za praćenje tjelesnog napretka - zahtijeva prijavu */}
        <Route
          path="/body"
          element={
            <PrivateRoute>
              <Progress />
            </PrivateRoute>
          }
        />

        {/* Stranica s kalkulatorima - dostupna svima */}
        <Route path="/calculators" element={<Calculators />} />

        {/* Stranica za praćenje prehrane - zahtijeva prijavu */}
        <Route
          path="/diet"
          element={
            <PrivateRoute>
              <Diet />
            </PrivateRoute>
          }
        />

        {/* Stranica za praćenje treninga - zahtijeva prijavu */}
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />

        {/* Stranica za AI chat - zahtijeva prijavu */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
