// Komponenta za zaštitu privatnih ruta u aplikaciji
// Preusmjerava neautorizirane korisnike na stranicu za prijavu
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Dohvaćanje tokena, prikazivanje i preusmjeravanje
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
