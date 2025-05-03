// Utility funkcije za upravljanje mjerenjima tijela i napretkom
// Pomaže u formatiranju, konverziji i praćenju tjelesnih mjera korisnika

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
  leftCalf: "", // Lijevo tele
  rightCalf: "", // Desno tele
};

// Izvoz oznaka mjerenja s istim ključevima kao i initialMeasurements
// Koriste se za mapiranje ključeva na njihove ključeve prijevoda u komponentama
export const measurementLabels = Object.keys(initialMeasurements).reduce(
  (acc, key) => {
    acc[key] = key; // Postavlja ključ kao vrijednost za korištenje u prijevodima
    return acc;
  },
  {}
);

// Ove oznake su uklonjene jer se sada obrađuju kroz sustav prijevoda
// Ključevi mjerenja koriste se izravno s translacijskim sustavom

// Pomoćna funkcija za formatiranje mjerenja iz API odgovora
// Pretvara podatke iz formata API-ja u format koji koristi aplikacija
export const formatMeasurements = (data) => {
  return Object.fromEntries(
    Object.entries(initialMeasurements).map(([k]) => [
      k,
      data.measurements?.[k]?.toString() || "", // Pretvorba u string ili prazni string ako vrijednost ne postoji
    ])
  );
};

// Pomoćna funkcija za pretvorbu svih mjerenja između metričkog i imperijalnog sustava
// Podržava dvosmjernu konverziju između centimetara i inča
export const convertMeasurements = (measurements, fromUnit, toUnit) => {
  // Ako su mjerne jedinice iste ili su mjerenja prazna, vraća nepromijenjeno
  if (fromUnit === toUnit || !measurements) {
    return measurements;
  }

  // Stvaranje novog objekta kako bi se izbjeglo mijenjanje ulaznog objekta
  const convertedMeasurements = {};

  // Pretvorba svake mjerne vrijednosti
  for (const [key, value] of Object.entries(measurements)) {
    if (value === "" || isNaN(parseFloat(value))) {
      convertedMeasurements[key] = value; // Zadrži prazne ili nevažeće vrijednosti nepromijenjene
    } else {
      if (fromUnit === "metric" && toUnit === "imperial") {
        // Pretvorba iz centimetara u inče (1 cm = 0.393701 inča)
        convertedMeasurements[key] = (parseFloat(value) * 0.393701).toFixed(2);
      } else if (fromUnit === "imperial" && toUnit === "metric") {
        // Pretvorba iz inča u centimetre (1 inč = 2.54 cm)
        convertedMeasurements[key] = (parseFloat(value) * 2.54).toFixed(2);
      }
    }
  }

  return convertedMeasurements;
};
