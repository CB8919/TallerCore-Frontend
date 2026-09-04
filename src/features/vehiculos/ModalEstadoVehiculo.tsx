import { useState } from "react";
import api from "../../services/api";

interface Props {
  patente: string;
  marca: string;
  modelo: string;
  estadoActual: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEstadoVehiculo({
  patente,
  marca,
  modelo,
  estadoActual,
  onClose,
  onSuccess,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const esActivo = estadoActual === "ACTIVO";
  const endpoint = esActivo
    ? `/api/vehiculos/${patente}/desactivar`
    : `/api/vehiculos/${patente}/activar`;

  async function handleConfirmar() {
    setError(null);
    setLoading(true);

    try {
      await api.patch(endpoint);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
        setError(data?.mensaje ?? "No se pudo realizar la operación");
      } else {
        setError("No se pudo realizar la operación");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">

        <h2 className="text-[#111827] font-semibold text-lg mb-2">
          {esActivo ? "Desactivar vehículo" : "Activar vehículo"}
        </h2>
        <p className="text-[#6b7280] text-sm mb-6">
          ¿Estás seguro que querés {esActivo ? "desactivar" : "activar"} el vehículo{" "}
          <span className="font-medium text-[#111827]">
            {marca} {modelo} ({patente})
          </span>
          ?
        </p>

        {error && (
          <p className="text-[#EF4444] text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className={`text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
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