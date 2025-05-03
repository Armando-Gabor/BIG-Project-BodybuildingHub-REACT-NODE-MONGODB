// Komponenta za prikaz animacije učitavanja
// Prikazuje animirani spinner dok se sadržaj učitava
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-64">
      {/* Animirani spinner koji se vrti */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
};

export default LoadingScreen;
