import { useState } from "react";
import {
  cambiarEstadoUsuario,
  mensajeError,
  type Usuario,
} from "./usuariosApi";

interface Props {
  usuario: Usuario;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEstadoUsuario({ usuario, onClose, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const esActivo = usuario.estado === "ACTIVO";
  const nuevoEstado = esActivo ? "INACTIVO" : "ACTIVO";
  const accion = esActivo ? "desactivar" : "activar";

  async function handleConfirmar() {
    setError(null);
    setLoading(true);
    try {
      await cambiarEstadoUsuario(usuario.dni, nuevoEstado);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(mensajeError(error, "No se pudo realizar la operación."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-[#111827]">
          {esActivo ? "Desactivar usuario" : "Activar usuario"}
        </h2>
        <p className="mb-6 text-sm text-[#6b7280]">
          ¿Estás seguro que querés {accion} a{" "}
          <span className="font-medium text-[#111827]">
            {usuario.nombre} {usuario.apellido}
          </span>
          ?
        </p>

        {error && <p className="mb-4 text-sm text-[#EF4444]">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[#6b7280] transition-colors hover:text-[#111827]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              esActivo
                ? "bg-[#EF4444] hover:bg-red-700"
                : "bg-[#22C55E] hover:bg-green-700"
            }`}
          >
            {loading ? "Procesando..." : esActivo ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}
