import { useState } from "react";
import { mensajeError, resetearPasswordUsuario } from "./usuariosApi";

interface Props {
  dni: string;
  nombre: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalResetPassword({ dni, nombre, onClose, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres alfanuméricos.");
      return;
    }
    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetearPasswordUsuario(dni, password);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(mensajeError(error, "No se pudo restablecer la contraseña."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold text-[#111827]">Restablecer contraseña</h2>
        <p className="mb-5 text-sm text-[#6b7280]">{nombre} · DNI {dni}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Nueva contraseña
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
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Confirmar contraseña
            <input
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
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
              {loading ? "Guardando..." : "Restablecer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
