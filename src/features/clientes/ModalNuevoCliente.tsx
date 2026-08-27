import { useState } from "react";
import { Info } from "lucide-react";
import api from "../../services/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface Errores {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
}

export default function ModalNuevoCliente({ onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validar(): boolean {
    const nuevosErrores: Errores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    if (!/^\d{8}$/.test(dni)) nuevosErrores.dni = "El DNI debe tener exactamente 8 dígitos";
    if (!telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorGeneral(null);
    if (!validar()) return;

    setLoading(true);
    try {
      await api.post("/api/clientes", { nombre, apellido, dni, telefono, email });
      onSuccess();
      onClose();
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "response" in error
        ) {
            const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
            setErrorGeneral(data?.mensaje ?? "No se pudo registrar el cliente");
        } else {
            setErrorGeneral("No se pudo registrar el cliente");
        }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (campo: keyof Errores) =>
    `border rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none w-full ${
      errores[campo]
        ? "border-[#EF4444] focus:border-[#EF4444]"
        : "border-[#d1d5db] focus:border-[#2563EB]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">

        {/* Título */}
        <h2 className="text-[#111827] font-bold text-xl mb-1">Nuevo Cliente</h2>
        <p className="text-[#6b7280] text-sm mb-4">
          Complete los datos para registrar un nuevo cliente
        </p>

        {/* Banner informativo 
        <div className="flex items-center gap-2 bg-[#DBEAFE] text-[#1E40AF] text-sm px-4 py-3 rounded-lg mb-6">
          <Info size={16} className="shrink-0" />
          <span>Solo se permite editar Teléfono y Email</span>
        </div>*/}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Juan"
                className={inputClass("nombre")}
              />
              {errores.nombre && (
                <p className="text-[#EF4444] text-xs">{errores.nombre}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. Pérez"
                className={inputClass("apellido")}
              />
              {errores.apellido && (
                <p className="text-[#EF4444] text-xs">{errores.apellido}</p>
              )}
            </div>
          </div>

          {/* Fila 2: DNI y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">DNI</label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej. 12345678"
                maxLength={8}
                className={inputClass("dni")}
              />
              {errores.dni && (
                <p className="text-[#EF4444] text-xs">{errores.dni}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. +54 987654321"
                className={inputClass("telefono")}
              />
              {errores.telefono && (
                <p className="text-[#EF4444] text-xs">{errores.telefono}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Email <span className="text-[#6b7280] font-normal">(opcional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej. juan@correo.com"
              className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#2563EB] w-full"
            />
          </div>

          {errorGeneral && (
            <p className="text-[#EF4444] text-sm">{errorGeneral}</p>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-sm border border-[#d1d5db] text-[#6b7280] hover:text-[#111827] px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}