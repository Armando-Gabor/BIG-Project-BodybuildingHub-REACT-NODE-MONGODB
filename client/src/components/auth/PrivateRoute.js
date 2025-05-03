// filepath: c:\Root\Faks\Diplomski rad\implementacija\client\src\components\auth\PrivateRoute.js
// Komponenta za zaštitu privatnih ruta u aplikaciji
// Preusmjerava neautorizirane korisnike na stranicu za prijavu
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Dohvaćanje tokena iz lokalnog spremišta
  return token ? children : <Navigate to="/login" replace />; // Ako token postoji, prikazuje se zaštićeni sadržaj, inače preusmjeravanje na prijavu
};

export default PrivateRoute;
