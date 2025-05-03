// Utility funkcije za rad s prehranom i nutritivnim vrijednostima

// Inicijalno stanje nove namirnice
// Koristi se kod dodavanja nove namirnice u obrok
export const initialFood = {
  name: "", // Naziv namirnice
  grams: "", // Količina u gramima
  protein: "", // Proteini po 100g
  carbs: "", // Ugljikohidrati po 100g
  fats: "", // Masti po 100g
};

// Izračun makronutrijenata za namirnicu na temelju unesenih grama i vrijednosti po 100g
export function calculateMacros(food) {
  const grams = parseFloat(food.grams) || 0;
  const proteinPer100 = parseFloat(food.protein) || 0;
  const carbsPer100 = parseFloat(food.carbs) || 0;
  const fatsPer100 = parseFloat(food.fats) || 0;

  // Faktor pretvorbe: uneseni grami / 100g
  const factor = grams / 100;

  // Izračun stvarnih vrijednosti makronutrijenata za unesenu količinu
  const protein = +(proteinPer100 * factor).toFixed(2); // Stvarna količina proteina
  const carbs = +(carbsPer100 * factor).toFixed(2); // Stvarna količina ugljikohidrata
  const fats = +(fatsPer100 * factor).toFixed(2); // Stvarna količina masti

  // Izračun ukupnih kalorija prema formuli: proteini*4 + ugljikohidrati*4 + masti*9
  const calories = +(protein * 4 + carbs * 4 + fats * 9).toFixed(2);

  // Vraća originalnu namirnicu s ažuriranim vrijednostima
  return { ...food, grams, protein, carbs, fats, calories };
}

// Izračun ukupnih makronutrijenata za popis namirnica (obrok)
export function calculateTotalMacros(foods) {
  return foods.reduce(
    (acc, f) => {
      // Zbrajanje pojedinačnih makronutrijenata i kalorija
      acc.protein += f.protein;
      acc.carbs += f.carbs;
      acc.fats += f.fats;
      acc.calories += f.calories;
      return acc;
    },
    { protein: 0, carbs: 0, fats: 0, calories: 0 } // Početne vrijednosti zbroja
  );
}
