// Utility funkcije za kalkulatore u aplikaciji
// Sadrži formule i funkcije za izračune

// Faktori konverzije između metričkog i imperijalnog sustava
export const unitConversions = {
  // Težina: kilogrami <-> funte
  kgToLbs: 2.20462,
  lbsToKg: 0.453592,

  // Visina: centimetri <-> inči
  cmToInches: 0.393701,
  inchesToCm: 2.54,
};

// Izračun indeksa tjelesne mase (BMI)
export const calculateBMI = (weight, height, unitSystem) => {
  // Konverzija u metrički sustav za izračun ako se koristi imperijalni
  let h, w;
  if (unitSystem === "imperial") {
    // Pretvorba visine iz inča u metre
    h = (parseFloat(height) * unitConversions.inchesToCm) / 100;
    // Pretvorba težine iz funti u kilograme
    w = parseFloat(weight) * unitConversions.lbsToKg;
  } else {
    // Metrički sustav - pretvorba centimetara u metre
    h = parseFloat(height) / 100;
    w = parseFloat(weight);
  }

  // Formula za BMI: težina (kg) / (visina (m) * visina (m))
  const bmi = w / (h * h);
  return bmi.toFixed(2); // Zaokruživanje na 2 decimale
};

// Funkcija za vraćanje interpretacije BMI vrijednosti i poruke
export const getBMIMessage = (bmi, t) => {
  let msg = "";
  if (bmi < 18.5) msg = t("calculators.bmi.interpretations.underweight");
  else if (bmi < 25) msg = t("calculators.bmi.interpretations.normal");
  else if (bmi < 30) msg = t("calculators.bmi.interpretations.overweight");
  else msg = t("calculators.bmi.interpretations.obese");

  return `${t("calculators.bmi.interpretations.prefix")} ${msg}`;
};

// Izračun bazalnog metabolizma (BMR) koristeći Oxford/Henry metodu
export const calculateBMR = (gender, weight, height, age, unitSystem) => {
  let w, h;
  const a = parseInt(age, 10);

  // Konverzija u metrički sustav za izračun ako se koristi imperijalni
  if (unitSystem === "imperial") {
    w = parseFloat(weight) * unitConversions.lbsToKg;
    h = parseFloat(height) * unitConversions.inchesToCm;
  } else {
    w = parseFloat(weight);
    h = parseFloat(height);
  }

  // Izračun BMR-a prema formuli ovisno o spolu i godinama
  let bmr = 0;
  if (gender === "male") {
    if (a >= 18 && a < 30) {
      bmr = 14.4 * w + 3.13 * h + 113;
    } else if (a >= 30 && a < 60) {
      bmr = 11.4 * w + 5.41 * h - 137;
    } else if (a >= 60) {
      bmr = 11.4 * w + 5.41 * h - 256;
    }
  } else if (gender === "female") {
    if (a >= 18 && a < 30) {
      bmr = 10.4 * w + 6.15 * h - 282;
    } else if (a >= 30 && a < 60) {
      bmr = 8.18 * w + 5.02 * h - 11.6;
    } else if (a >= 60) {
      bmr = 8.52 * w + 4.21 * h + 10.7;
    }
  }

  return bmr ? bmr.toFixed(0) : null;
};

// Faktori množenja za razine fizičke aktivnosti
export const activityLevels = [
  { value: 1, label: "1" }, // Sjedeći način života
  { value: 1.15, label: "1.15" }, // Minimalna aktivnost
  { value: 1.3, label: "1.3" }, // Lagana aktivnost
  { value: 1.6, label: "1.6" }, // Umjerena aktivnost
  { value: 2, label: "2" }, // Intenzivna aktivnost
];

// MET vrijednosti za različite kardio aktivnosti
// MET = Metabolički ekvivalent zadatka, mjera intenziteta aktivnosti (veći MET = veća potrošnja kalorija)
export const METS = {
  running: 9.8,
  cycling: 7.5,
  walking: 3.8,
  swimming: 8.0,
  rowing: 7.0,
  elliptical: 5.0,
  jogging: 7.0,
  hiking: 6.0,
  aerobics: 6.5,
  dancing: 4.5,
  basketball: 6.5,
  football: 8.0,
  tennis: 7.0,
};

// Izračun potrošenih kalorija tijekom kardio vježbi
export const calculateCaloriesBurned = (
  activity,
  minutes,
  weight,
  unitSystem
) => {
  // Konverzija težine u kg za izračun ako se koristi imperijalni sustav
  let weightInKg = weight;
  if (unitSystem === "imperial") {
    weightInKg = parseFloat(weight) * unitConversions.lbsToKg;
  } else {
    weightInKg = parseFloat(weight);
  }

  // Izračun potrošenih kalorija prema MET vrijednosti aktivnosti
  const met = METS[activity];
  const calories = met * weightInKg * (minutes / 60);
  return calories > 0 ? calories.toFixed(0) : null;
};
