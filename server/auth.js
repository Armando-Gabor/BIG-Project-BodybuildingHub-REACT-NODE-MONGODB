// Autentifikacijski modul za upravljanje JWT tokenima i autentifikaciju korisnika
// Osigurava autorizirani pristup zaštićenim rutama kroz middleware funkcije
const jwt = require("jsonwebtoken");

// Uvoz modela korisnika iz baze podataka
const { User } = require("./db");

// JWT konfiguracija - dohvaćanje tajnog ključa i trajanja tokena iz okolišnih varijabli
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

// Provjera postojanja JWT_SECRET ključa
// Bez ovog ključa, sigurnosni sustav ne može funkcionirati
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not defined");
  process.exit(1);
}

// Middleware za autentifikaciju zahtjeva korištenjem JWT tokena
// Izvlači token iz Authorization zaglavlja, verificira ga i povezuje korisnika sa zahtjevom (kod zaštićenih ruta)
const authMiddleware = async (req, res, next) => {
  try {
    // Izvlačenje i validacija Authorization zaglavlja iz zahtjeva
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Izdvajanje tokena iz zaglavlja - podržava formate "Bearer token" i samo "token"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verifikacija tokena i izvlačenje podataka
    // Dekodiranje tokena pomoću JWT_SECRET ključa
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // Pronalaženje odgovarajućeg korisnika u bazi
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sigurnosna provjera: provjera je li token izdan prije promjene lozinke
    // Ovo sprječava korištenje starih tokena nakon što korisnik promijeni lozinku
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          success: false,
          message: "User recently changed password. Please log in again",
        });
      }
    }

    // Ako je autentifikacija uspješna - daljnja obrada zahtjeva
    req.user = user;
    next();
  } catch (error) {
    // Obrada specifičnih JWT grešaka s prilagođenim porukama
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Obrada neočekivanih grešaka
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Stvara JWT token za korisnika s definiranim vremenom isteka
// Token sadrži osnovne podatke o korisniku potrebne za autentifikaciju
const createToken = (user, expiresIn = TOKEN_EXPIRY) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    },
    JWT_SECRET,
    { expiresIn }
  );
};

// Izvoz funkcionalnosti za korištenje u drugim dijelovima aplikacije
module.exports = {
  authMiddleware,
  createToken,
  JWT_SECRET,
};
