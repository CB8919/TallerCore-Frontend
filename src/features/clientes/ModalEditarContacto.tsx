import { useState } from "react";
import api from "../../services/api";

interface Props {
  dni: string;
  telefonoActual: string;
  emailActual: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditarContacto({
  dni,
  telefonoActual,
  emailActual,
  onClose,
  onSuccess,
}: Props) {
  const [telefono, setTelefono] = useState(telefonoActual);
  const [email, setEmail] = useState(emailActual);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!telefono.trim()) {
      setError("El teléfono es obligatorio");
      return;
    }

    setLoading(true);

    try {
      await api.patch(`/api/clientes/${dni}/contacto`, { telefono, email });
      onSuccess();
      onClose();
    } catch {
      setError("No se pudo actualizar el contacto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        {/* Título */}
        <h2 className="text-[#111827] font-semibold text-lg mb-1">
          Editar contacto
        </h2>
        <p className="text-[#6b7280] text-sm mb-6">
          Solo se puede modificar el teléfono y el email
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Teléfono
            </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm">{error}</p>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}