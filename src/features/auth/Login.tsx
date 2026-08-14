import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png"
import bgLogin from "../../assets/fondo_login.png"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!dni.trim()) {
      setError("El DNI es obligatorio");
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      setError("El DNI debe tener exactamente 8 dígitos numéricos");
      return;
    }

    if (!password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }

    try {
  await login({ dni, password });
  navigate("/dashboard");
} catch (error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: unknown } }).response?.data === "string"
  ) {
    setError((error as { response: { data: string } }).response.data);
  } else {
    setError("Error al iniciar sesión");
  }
}
  }

  return (
    // Background image div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center px-4"
    <div className="min-h-screen flex items-center justify-center px-4"
  style={{
    backgroundImage: `url(${bgLogin})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}>
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-20 w-auto" />
          <p className="text-[#1a2035] font-bold text-lg tracking-wide">
            Forge Labs
          </p>
        </div>

        {/* Títulos */}
        <h1 className="text-[#111827] text-2xl font-semibold text-center mb-1">
          Bienvenido a TallerCore
        </h1>
        <p className="text-[#6b7280] text-sm text-center mb-6">
          Ingrese sus credenciales para acceder al sistema
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label htmlFor="dni" className="text-[#111827] text-sm font-medium">
              DNI
            </label>
            <input
              id="dni"
              type="text"
              name="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingrese su DNI"
              className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[#111827] text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="bg-[#2563EB] text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>

        {/* Recuperar contraseña */}
        <div className="mt-4 text-center">
          <a href="#" className="text-[#2563EB] text-sm hover:underline">
            ¿Olvidó su contraseña?
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-[#6b7280] text-xs">
          © 2026 CB Forge Labs - TallerCore
        </footer>

      </div>
    </div>
  );
}