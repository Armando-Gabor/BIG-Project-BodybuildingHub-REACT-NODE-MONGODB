// Stranica za prijavu i registraciju korisnika
// Omogućuje korisnicima pristup aplikaciji kroz autentifikaciju
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [isLoginView, setIsLoginView] = useState(true); // Stanje za praćenje prikaza (prijava/registracija)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }); // Stanje za podatke obrasca
  const navigate = useNavigate(); // Hook za navigaciju

  // Funkcija za slanje podataka za prijavu/registraciju
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:5000/api";
    const endpoint = isLoginView ? "/auth/login" : "/auth/register"; // Odabir krajnje točke ovisno o prikazu

    try {
      // Slanje zahtjeva na server
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLoginView
            ? { email: formData.email, password: formData.password } // Podaci za prijavu
            : {
                username: formData.username,
                email: formData.email,
                password: formData.password,
              } // Podaci za registraciju
        ),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Server error");
      }

      // Pohrana tokena nakon uspješne prijave/registracije
      const { token } = await response.json();
      localStorage.setItem("token", token);
      navigate("/body"); // Preusmjeravanje na stranicu za praćenje napretka
    } catch (err) {
      console.error("Auth error:", err);
      // Prikaz poruke o grešci
      alert(
        err.message ||
          (isLoginView ? t("login.error") : t("login.registerError"))
      );
    }
  };

  // Funkcija za praćenje promjena u poljima obrasca
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg max-w-md w-full backdrop-blur-sm">
        {/* Naslov */}
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {t("app.title")}
          </Link>
        </div>

        <div className="space-y-4">
          {/* Prekidač između prijave i registracije */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setIsLoginView(true)}
              className={`flex-1 py-2 text-center rounded-lg transition-colors cursor-pointer ${
                isLoginView
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t("login.loginButton")}
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`flex-1 py-2 text-center rounded-lg transition-colors cursor-pointer ${
                !isLoginView
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t("login.registerButton")}
            </button>
          </div>

          {/* Obrazac za prijavu/registraciju */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Polje za korisničko ime (registracijski tab) */}
            {!isLoginView && (
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder={t("login.username")}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
            )}
            {/* Polje za email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder={t("login.email")}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            {/* Polje za lozinku */}
            <div>
              <input
                type="password"
                name="password"
                placeholder={t("login.password")}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            {/* Polje za potvrdu lozinke (registracijski tab) */}
            {!isLoginView && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={t("login.confirmPassword")}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
            )}
            {/* Gumb za slanje obrasca */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isLoginView ? t("login.loginButton") : t("login.registerButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
