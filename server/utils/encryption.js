// Utility funkcije za sigurnu enkripciju i dekripciju nekih informacija korisnika
const crypto = require("crypto");

// Konfiguracija enkripcije iz okolišnih varijabli
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_IV = process.env.ENCRYPTION_IV;
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM || "aes-256-ctr"; // Algoritam AES-256 Counter mode

// Validacija konfiguracije enkripcije
if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
  console.error("FATAL ERROR: Encryption configuration is incomplete");
  process.exit(1);
}

// Funkcija za kriptiranje (enkripciju) teksta korištenjem AES-256-CTR algoritma
function encrypt(text) {
  try {
    // Ako nema teksta, vraća original
    if (!text) return text;

    // Dekodiranje Base64 ključa/IV u Buffer objekt (jer crypto funkcije rade s buffer objektima)
    const iv = Buffer.from(ENCRYPTION_IV, "base64");
    const key = Buffer.from(ENCRYPTION_KEY, "base64");

    // Stvaranje cipher objekta s odabranim algoritmom i ključevima
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

    // Kriptiranje teksta i pretvaranje u heksadecimalni format
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  } catch (err) {
    // Obrada grešaka pri kriptiranju
    console.error("Encryption error:", err);
    return text; // U slučaju greške vraća originalni tekst
  }
}

// Funkcija za dekriptiranje teksta korištenjem AES-256-CTR algoritma
function decrypt(encryptedText) {
  try {
    // Provjera je li ulaz validan heksadecimalni string (Ako nije, vraća original bez pokušaja dekriptiranja)
    if (
      !encryptedText ||
      typeof encryptedText !== "string" ||
      !/^[0-9a-f]+$/i.test(encryptedText)
    ) {
      return encryptedText;
    }

    // Dekodiranje Base64 ključa/IV u Buffer objekt (jer crypto funkcije rade s buffer objektima)
    const iv = Buffer.from(ENCRYPTION_IV, "base64");
    const key = Buffer.from(ENCRYPTION_KEY, "base64");

    // Stvaranje decipher objekta za dekriptiranje
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);

    // Dekriptiranje teksta iz heksadecimalnog u UTF-8 format
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    // Obrada grešaka pri dekriptiranju
    console.error("Decryption error:", err);
    return encryptedText; // U slučaju greške vraća originalni tekst
  }
}

// Izvoz funkcija za korištenje u drugim modulima aplikacije
module.exports = {
  encrypt,
  decrypt,
};
