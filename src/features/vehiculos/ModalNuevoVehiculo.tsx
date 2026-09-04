import { useState } from "react";
import { Info } from "lucide-react";
import api from "../../services/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface Errores {
  dniCliente?: string;
  patente?: string;
  marca?: string;
  modelo?: string;
  anio?: string;
}

export default function ModalNuevoVehiculo({ onClose, onSuccess }: Props) {
  const [dniCliente, setDniCliente] = useState("");
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validar(): boolean {
    const nuevosErrores: Errores = {};

    if (!/^\d{8}$/.test(dniCliente))
      nuevosErrores.dniCliente = "El DNI debe tener exactamente 8 dígitos";

    if (!/^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/.test(patente))
      nuevosErrores.patente = "Formato válido: AAA111 o AA111AA";

    if (!marca.trim())
      nuevosErrores.marca = "La marca es obligatoria";

    if (!modelo.trim())
      nuevosErrores.modelo = "El modelo es obligatorio";

    const anioNum = parseInt(anio);
    if (!anio || isNaN(anioNum) || anioNum < 1901 || anioNum > 2026)
      nuevosErrores.anio = "El año debe estar entre 1901 y 2026";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorGeneral(null);
    if (!validar()) return;

    setLoading(true);
    try {
      await api.post("/api/vehiculos", {
        dniCliente,
        patente,
        marca,
        modelo,
        anio: parseInt(anio),
      });
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
        setErrorGeneral(data?.mensaje ?? "No se pudo registrar el vehículo");
      } else {
        setErrorGeneral("No se pudo registrar el vehículo");
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
        <h2 className="text-[#111827] font-bold text-xl mb-1">Nuevo Vehículo</h2>
        <p className="text-[#6b7280] text-sm mb-4">
          Complete los datos para registrar un nuevo vehículo
        </p>

        {/* Banner */}
        <div className="flex items-center gap-2 bg-[#DBEAFE] text-[#1E40AF] text-sm px-4 py-3 rounded-lg mb-6">
          <Info size={16} className="shrink-0" />
          <span>El vehículo se asocia al cliente mediante su DNI</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* DNI Cliente */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">DNI del Cliente</label>
            <input
              type="text"
              value={dniCliente}
              onChange={(e) => setDniCliente(e.target.value)}
              placeholder="Ej. 12345678"
              maxLength={8}
              className={inputClass("dniCliente")}
            />
            {errores.dniCliente && (
              <p className="text-[#EF4444] text-xs">{errores.dniCliente}</p>
            )}
          </div>

          {/* Patente */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">Patente</label>
            <input
              type="text"
              value={patente}
              onChange={(e) => setPatente(e.target.value.toUpperCase())}
              placeholder="Ej. AAA111 o AA111AA"
              maxLength={7}
              className={inputClass("patente")}
            />
            {errores.patente && (
              <p className="text-[#EF4444] text-xs">{errores.patente}</p>
            )}
          </div>

          {/* Marca y Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">Marca</label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ej. Toyota"
                className={inputClass("marca")}
              />
              {errores.marca && (
                <p className="text-[#EF4444] text-xs">{errores.marca}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#111827] text-sm font-medium">Modelo</label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ej. Corolla"
                className={inputClass("modelo")}
              />
              {errores.modelo && (
                <p className="text-[#EF4444] text-xs">{errores.modelo}</p>
              )}
            </div>
          </div>

          {/* Año */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">Año</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="Ej. 2020"
              min={1901}
              max={2026}
              className={inputClass("anio")}
            />
            {errores.anio && (
              <p className="text-[#EF4444] text-xs">{errores.anio}</p>
            )}
          </div>

          {errorGeneral && (
            <p className="text-[#EF4444] text-sm">{errorGeneral}</p>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm border border-[#d1d5db] text-[#6b7280] hover:text-[#111827] px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#10B981] transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}