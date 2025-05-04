// Utility funkcije za upravljanje mjerenjima tijela i napretkom

// Početne vrijednosti za mjerenja tijela
// Koristi se kao predložak za novi unos mjerenja
export const initialMeasurements = {
  neck: "", // Vrat
  shoulders: "", // Ramena
  chest: "", // Prsa
  waist: "", // Struk
  hips: "", // Bokovi
  leftThigh: "", // Lijevo bedro
  rightThigh: "", // Desno bedro
  leftUpperArm: "", // Lijeva nadlaktica
  rightUpperArm: "", // Desna nadlaktica
  leftLowerArm: "", // Lijeva podlaktica
  rightLowerArm: "", // Desna podlaktica
  leftCalf: "", // Lijevi list
  rightCalf: "", // Desni list
};

// Izvoz oznaka mjerenja s istim ključevima kao i initialMeasurements
export const measurementLabels = Object.keys(initialMeasurements).reduce(
  (acc, key) => {
    acc[key] = key; // Postavlja ključ kao vrijednost za korištenje u prijevodima
    return acc;
  },
  {}
);

// Pomoćna funkcija za formatiranje mjerenja iz API odgovora
export const formatMeasurements = (data) => {
  return Object.fromEntries(
    Object.entries(initialMeasurements).map(([k]) => [
      k,
      data.measurements?.[k]?.toString() || "",
    ])
  );
};
