// Komponenta za definiranje javnih ruta u aplikaciji
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Dohvaćanje tokena, prikazivanje i preusmjeravanje
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/body" replace />;
};

export default PublicRoute;
