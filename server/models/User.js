// Model korisnika (User) - definira strukturu podataka i ponašanje korisničkih računa
const mongoose = require("mongoose");
const { Schema } = mongoose;
const argon2 = require("argon2"); // Sigurna biblioteka za hashiranje lozinki
const { encrypt, decrypt } = require("../utils/encryption"); // Utility za enkripciju/dekripciju

// Definicija sheme korisnika
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      // Setter koji automatski kriptira korisničko ime prije spremanja u bazu
      set: function (username) {
        this._plainUsername = username;
        return encrypt(username);
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
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

    // Hashiranje lozinke korištenjem Argon2 algoritma
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
// Omogućuje da se korisniku prikaže njegovo nekriptirano ime
userSchema.methods.getDecryptedUsername = function () {
  try {
    return decrypt(this.username);
  } catch (err) {
    console.error("Error decrypting username:", err);
    return this.username; // U slučaju greške vraća kriptirano ime
  }
};

// Stvaranje modela korisnika iz definirane sheme
const User = mongoose.model("User", userSchema);

module.exports = User;
