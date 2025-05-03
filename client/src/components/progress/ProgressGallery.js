// Komponenta za prikaz i upravljanje galerijom fotografija napretka
// Omogućava učitavanje, pregled i brisanje fotografija grupiranih po datumima
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ProgressGallery = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [selectedImage, setSelectedImage] = useState(null); // Stanje za odabranu sliku za učitavanje
  const [selectedImageName, setSelectedImageName] = useState(""); // Stanje za ime odabrane slike
  const [uploadMessage, setUploadMessage] = useState(""); // Stanje za poruku o učitavanju
  const [galleryImages, setGalleryImages] = useState([]); // Stanje za liste slika iz galerije
  const [presignedUrls, setPresignedUrls] = useState({}); // Stanje za URL-ove slika
  const [expandedDates, setExpandedDates] = useState({}); // Stanje za datume u galeriji
  const [view, setView] = useState("gallery"); // Stanje za trenutni tab ('gallery' ili 'upload')
  const [modalImage, setModalImage] = useState(null); // Stanje za prikaz uvećane slike u modalnom prozoru

  // Učitavanje slika iz galerije prilikom inicijalizacije komponente
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Dohvat predpotpisanih URL-ova za sve slike kad se lista slika promijeni
  useEffect(() => {
    // Funkcija za dohvat predpotpisanih URL-ova za sve slike
    const fetchPresignedUrls = async () => {
      const token = localStorage.getItem("token");
      const urls = {};
      await Promise.all(
        galleryImages.map(async (image) => {
          try {
            const res = await fetch(
              `/api/images/${encodeURIComponent(image.filename)}`,
              {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
              }
            );
            if (res.ok) {
              const data = await res.json();
              urls[image.filename] = data.url;
            }
          } catch {}
        })
      );
      setPresignedUrls(urls);
    };
    if (galleryImages.length > 0) fetchPresignedUrls();
  }, [galleryImages]);

  // Funkcija za dohvat slika iz galerije s API-ja
  const fetchGalleryImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/images/gallery", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (response.ok) {
        const images = await response.json();
        setGalleryImages(images);
      } else {
        console.error("Failed to fetch gallery images");
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  // Funkcija za obradu promjene odabrane datoteke
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setSelectedImageName(file ? file.name : "");
  };

  // Funkcija za učitavanje slike
  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      setUploadMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    const imageDate = document.getElementById("imageDate").value;
    if (imageDate) {
      formData.append("uploadDate", imageDate);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/images/upload", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadMessage(
        t("progress.gallery.uploadSuccess", { filename: data.filename })
      );

      // Čišćenje forme nakon uspješnog učitavanja
      setSelectedImage(null);
      setSelectedImageName("");
      document.getElementById("imageDate").value = "";

      // Osvježavanje galerije
      await fetchGalleryImages();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage(error.message || t("progress.gallery.genericError"));
    }
  };

  // Funkcija za brisanje slike iz galerije
  const handleDeleteImage = async (image) => {
    if (!window.confirm(t("progress.gallery.confirmDelete"))) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/images/${encodeURIComponent(image.filename)}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      if (!res.ok) throw new Error(t("progress.gallery.deleteError"));
      // Uklanjanje iz korisničkog sučelja
      setGalleryImages((prev) => prev.filter((img) => img._id !== image._id));
      setUploadMessage(t("progress.gallery.deleteSuccess"));
    } catch (err) {
      setUploadMessage(err.message || t("progress.gallery.genericError"));
    }
  };

  // Grupiranje slika po datumu
  const imagesByDate = galleryImages.reduce((acc, image) => {
    const date = new Date(image.uploadDate).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(image);
    return acc;
  }, {});

  // Funkcija za otvaranje/zatvaranje prikaza slika za određeni datum
  const toggleDate = (date) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="shadow-xl rounded-2xl p-10 pb-12 mb-8 bg-gray-900">
      {/* Modalni prozor za prikaz uvećane slike */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage.url}
              alt={t("progress.gallery.enlargedImage")}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-80 rounded-full p-2 text-white hover:bg-red-600 transition-colors cursor-pointer"
              title={t("common.close")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Navigacijski gumbi za prebacivanje između tabova (upload i galerija) */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-6 py-2 rounded-lg font-bold text-lg transition-colors shadow-md cursor-pointer focus:outline-none ${
            view === "upload"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setView("upload")}
        >
          {t("progress.gallery.upload")}
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold text-lg transition-colors shadow-md cursor-pointer focus:outline-none ${
            view === "gallery"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setView("gallery")}
        >
          {t("progress.gallery.gallery")}
        </button>
      </div>
      {/* Forma za upload nove slike (upload tab) */}
      {view === "upload" && (
        <form onSubmit={handleImageUpload} className="flex flex-col gap-4">
          <label className="block mb-1 font-semibold text-gray-200">
            {t("progress.gallery.selectImage")}:
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="customFileInput"
              />
              <label
                htmlFor="customFileInput"
                className="flex items-center border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition hover:border-pink-400 focus:border-pink-400 cursor-pointer"
              >
                <span>
                  {selectedImageName || t("progress.gallery.selectImage")}
                </span>
              </label>
            </div>
          </label>
          <label className="block mb-1 font-semibold text-gray-200">
            {t("progress.gallery.selectDate")}:
            <input
              type="date"
              id="imageDate"
              name="imageDate"
              className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition hover:border-pink-400 focus:border-pink-400"
            />
          </label>
          <button
            type="submit"
            className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            {t("progress.gallery.uploadImage")}
          </button>
        </form>
      )}
      {/* Prikaz poruke o uspjehu/neuspjehu učitavanja (upload tab) */}
      {uploadMessage && view === "upload" && (
        <div className="mt-4 text-center text-sm font-semibold text-green-400">
          {uploadMessage}
        </div>
      )}
      {/* Prikaz galerije slika (gallery tab) */}
      {view === "gallery" && (
        <div className="flex flex-col gap-4 mt-8">
          {/* Poruka ako nema slika u galeriji */}
          {Object.keys(imagesByDate).length === 0 && (
            <div className="text-center text-gray-400">
              {t("progress.gallery.noImages")}
            </div>
          )}
          {/* Prikaz slika grupiranih po datumu */}
          {Object.entries(imagesByDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, images]) => (
              <div key={date}>
                {/* Zaglavlje za svaki datum s gumbom za proširivanje/sažimanje */}
                <button
                  className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white text-xl font-bold rounded-lg shadow-lg focus:outline-none mb-2 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => toggleDate(date)}
                >
                  <span>{date}</span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      expandedDates[date] ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {/* Prikaz svih slika za određeni datum (prikazuje se samo ako je datum proširen klikom) */}
                {expandedDates[date] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                    {images.map((image, idx) => (
                      <div key={image._id || idx} className="relative group">
                        <img
                          src={presignedUrls[image.filename] || ""}
                          alt={t("progress.gallery.progressImage", {
                            number: idx + 1,
                          })}
                          className="w-full h-auto rounded-md cursor-pointer"
                          onClick={() =>
                            setModalImage({
                              url: presignedUrls[image.filename] || "",
                            })
                          }
                        />
                        {/* Gumb za brisanje slike (vidljiv samo na hover)*/}
                        <button
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black bg-opacity-60 rounded-full p-1 text-white cursor-pointer hover:bg-red-500 shadow-lg transition-all duration-150"
                          title={t("common.delete")}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image);
                          }}
                        >
                          {/* Ikona za brisanje (Heroicons outline) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 7.5v10.125c0 .621.504 1.125 1.125 1.125h8.25c.621 0 1.125-.504 1.125-1.125V7.5m-12 0h13.5m-10.125 0V6.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProgressGallery;
