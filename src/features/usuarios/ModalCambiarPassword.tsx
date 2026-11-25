import { useState } from "react";
import { cambiarMiPasswordUsuario, mensajeError } from "./usuariosApi";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCambiarPassword({ onClose, onSuccess }: Props) {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (nuevaPassword !== confirmacion) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await cambiarMiPasswordUsuario(passwordActual, nuevaPassword);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(mensajeError(error, "No se pudo actualizar la contraseña."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold text-[#111827]">Cambiar contraseña</h2>
        <p className="mb-5 text-sm text-[#6b7280]">Ingresá tu contraseña actual y elegí una nueva.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Contraseña actual
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Nueva contraseña
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Confirmar nueva contraseña
            <input
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              autoComplete="new-password"
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
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
