// filepath: c:\Root\Faks\Diplomski rad\implementacija\client\src\components\auth\PublicRoute.js
// Komponenta za definiranje javnih ruta u aplikaciji
// Preusmjerava već prijavljene korisnike na početnu stranicu aplikacije
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Dohvaćanje tokena iz lokalnog spremišta
  return !token ? children : <Navigate to="/body" replace />; // Ako token ne postoji, prikazuje se javni sadržaj, inače preusmjeravanje na početnu stranicu
};

export default PublicRoute;
