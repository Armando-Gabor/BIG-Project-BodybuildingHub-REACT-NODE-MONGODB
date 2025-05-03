// Model korisnika (User) - definira strukturu podataka i ponašanje korisničkih računa
// Ovaj model podržava enkripciju korisničkih imena i sigurno hashiranje lozinki
const mongoose = require("mongoose");
const { Schema } = mongoose;
const argon2 = require("argon2"); // Sigurna biblioteka za hashiranje lozinki
const { encrypt, decrypt } = require("../utils/encryption"); // Utility za enkripciju/dekripciju

// --- Definicija sheme korisnika ---
// Shema određuje strukturu dokumenata u MongoDB kolekciji korisnika
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      // Setter koji automatski kriptira korisničko ime prije spremanja u bazu
      set: function (username) {
        // Čuva originalno korisničko ime za validaciju
        this._plainUsername = username;
        // Kriptira korisničko ime za pohranu u bazi
        return encrypt(username);
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // Osigurava da se email ne može ponoviti
      lowercase: true, // Automatski pretvara u mala slova
      trim: true, // Uklanja razmake s početka i kraja
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimalna duljina lozinke za sigurnost
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatski postavlja vrijeme stvaranja računa
    },
  },
  {
    timestamps: true, // Automatski dodaje createdAt i updatedAt polja
    toJSON: {
      // Transformira objekt pri pretvorbi u JSON - uklanja osjetljive podatke
      transform: function (doc, ret) {
        delete ret.password; // Nikad ne vraća lozinku kroz API
        delete ret.__v; // Uklanja Mongoose verziju dokumenta
        return ret;
      },
    },
  }
);

// Middleware koji se izvršava prije spremanja korisnika
// Automatski hashira lozinku pomoću Argon2 algoritma
userSchema.pre("save", async function (next) {
  try {
    // Hashira lozinku samo ako je modificirana
    if (!this.isModified("password")) return next();

    // Hashiranje lozinke korištenjem Argon2 algoritma (sigurniji od bcrypt/MD5)
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

// Metoda za provjeru lozinke - koristi se pri prijavi korisnika
// Uspoređuje unesenu lozinku s hashiranom verzijom u bazi
userSchema.methods.verifyPassword = async function (password) {
  return await argon2.verify(this.password, password);
};

// Metoda za dohvaćanje dekriptiranog korisničkog imena
// Ova metoda omogućuje da se korisniku prikaže njegovo nekriptirano ime
userSchema.methods.getDecryptedUsername = function () {
  try {
    return decrypt(this.username);
  } catch (err) {
    console.error("Error decrypting username:", err);
    return this.username; // U slučaju greške vraća kriptirano ime kao fallback
  }
};

// Stvaranje modela korisnika iz definirane sheme
// Ovaj model se koristi za sve operacije s korisničkim podacima u bazi
const User = mongoose.model("User", userSchema);

module.exports = User;
