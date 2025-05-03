// Rute za upravljanje slikama - upravljanje učitavanjem i dohvaćanjem slika iz AWS S3
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth");
const { Image } = require("../db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimalna veličina datoteke 10MB
});

// Konfiguracija AWS SDK v3 za S3 pohranu
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Inicijalizacija S3 klijenta s podacima za pristup iz env varijabli
// Ovi podaci omogućuju autentifikaciju s AWS servisom
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Naziv S3 bucketa u kojem se pohranjuju slike
const S3_BUCKET = process.env.AWS_S3_BUCKET;

/**
 * POST /upload
 * Ruta za učitavanje slike na S3 i spremanje reference u bazu podataka
 * Koristi multer middleware za obradu zahtjeva
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      // Provjera je li datoteka primljena
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file received",
        });
      }

      // Generiranje jedinstvenog ključa za S3 pohranu
      // Format: ID_korisnika/trenutno_vrijeme.ekstenzija
      const fileExt = req.file.originalname.split(".").pop();
      const s3Key = `${req.user.id}/${Date.now()}.${fileExt}`;

      // Definiranje parametara za S3 učitavanje
      const params = {
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      // Učitavanje slike na S3
      await s3.send(new PutObjectCommand(params));

      // Konstruiranje javnog URL-a za pristup slici
      const s3Url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      // Spremanje reference na sliku u MongoDB
      // Povezuje sliku s trenutno prijavljenim korisnikom
      const image = new Image({
        userId: req.user.id,
        filename: req.file.originalname,
        s3Key: s3Key,
        url: s3Url,
        uploadDate: req.body.uploadDate
          ? new Date(req.body.uploadDate)
          : new Date(),
      });

      await image.save();

      // Slanje uspješnog odgovora klijentu
      res.status(201).json({
        success: true,
        url: image.url,
        filename: image.filename,
        uploadDate: image.uploadDate,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      // Obrada grešaka pri učitavanju
      res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

/**
 * GET /gallery
 * Dohvaća sve slike za prijavljenog korisnika
 * Vraća sortirane slike za prikaz u galeriji napretka
 */
router.get("/gallery", authMiddleware, async (req, res) => {
  try {
    // Dohvaćanje svih slika korisnika sortirano od najnovije
    const images = await Image.find({ userId: req.user.id }).sort({
      uploadDate: -1,
    });

    // Slanje popisa slika klijentu
    res.json(images);
  } catch (error) {
    // Obrada grešaka pri dohvaćanju galerije
    res.status(500).json({
      message: "Error retrieving gallery images",
      error: error.message,
    });
  }
});

/**
 * GET /:filename
 * Generira privremeni potpisani URL za pristup zaštićenoj slici
 * Sigurni pristup S3 resursima ograničenog trajanja
 */
router.get("/:filename", authMiddleware, async (req, res) => {
  try {
    // Pronalaženje zapisa o slici u bazi
    const image = await Image.findOne({
      userId: req.user.id,
      filename: req.params.filename,
    });

    // Provjera postoji li tražena slika
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Generiranje privremenog potpisanog URL-a za pristup slici na S3
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: image.s3Key,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // Url vrijedi 5 minuta

    return res.json({ url: presignedUrl });
  } catch (error) {
    // Obrada grešaka pri generiranju URL-a
    res.status(500).json({
      message: "Error serving image",
      error: error.message,
    });
  }
});

/**
 * DELETE /:filename
 * Briše sliku iz S3 pohrane i reference iz baze podataka
 * Omogućuje korisnicima da uklone neželjene slike iz svoje galerije
 */
router.delete("/:filename", authMiddleware, async (req, res) => {
  try {
    // Pronalaženje zapisa o slici u bazi
    const image = await Image.findOne({
      userId: req.user.id,
      filename: req.params.filename,
    });

    // Provjera postoji li tražena slika
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Brisanje slike iz S3 pohrane
    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: image.s3Key,
      })
    );

    // Brisanje reference iz MongoDB baze
    await Image.deleteOne({ _id: image._id });

    // Slanje potvrde o uspješnom brisanju
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    // Obrada grešaka pri brisanju
    res.status(500).json({
      message: "Error deleting image",
      error: error.message,
    });
  }
});

module.exports = router;
