import { useState } from "react";
import {
  crearUsuario,
  mensajeError,
  type RolUsuario,
} from "./usuariosApi";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalNuevoUsuario({ onClose, onSuccess }: Props) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<RolUsuario>("MECANICO");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!/^\d{8}$/.test(dni)) {
      setError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres alfanuméricos.");
      return;
    }

    setLoading(true);
    try {
      await crearUsuario({ dni, nombre, apellido, email, password, rol });
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(mensajeError(error, "No se pudo crear el usuario."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold text-[#111827]">Nuevo usuario</h2>
        <p className="mb-5 text-sm text-[#6b7280]">Completá los datos de la cuenta.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
              DNI
              <input
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                inputMode="numeric"
                maxLength={8}
                required
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
              Rol
              <select value={rol} onChange={(e) => setRol(e.target.value as RolUsuario)} className={inputClass}>
                <option value="MECANICO">MECANICO</option>
                <option value="ADMIN_MECANICO">ADMIN_MECANICO</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
              Nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
              Apellido
              <input value={apellido} onChange={(e) => setApellido(e.target.value)} required className={inputClass} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Contraseña inicial
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              pattern="[a-zA-Z0-9]+"
              required
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-[#EF4444]">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#6b7280]">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
