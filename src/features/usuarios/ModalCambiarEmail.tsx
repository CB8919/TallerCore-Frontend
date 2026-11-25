import { useState } from "react";
import { cambiarMiEmailUsuario, mensajeError } from "./usuariosApi";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCambiarEmail({ onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nuevoEmail = email.trim();
    if (nuevoEmail.toLowerCase() !== confirmacion.trim().toLowerCase()) {
      setError("Los emails no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await cambiarMiEmailUsuario(nuevoEmail);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(mensajeError(error, "No se pudo actualizar el email."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold text-[#111827]">Cambiar email</h2>
        <p className="mb-5 text-sm text-[#6b7280]">Actualizá el email de tu cuenta.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Nuevo email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]">
            Confirmar email
            <input
              type="email"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              autoComplete="email"
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
              {loading ? "Guardando..." : "Guardar email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
