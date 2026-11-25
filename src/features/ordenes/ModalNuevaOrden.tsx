import { useState } from "react";
import api from "../../services/api";
import { AlertCircle, Car } from "lucide-react";

interface Vehiculo {
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  dniCliente: string;
  nombreCliente: string;
  apellidoCliente: string;
  estado: string;
}

interface Props {
  vehiculos: Vehiculo[];
  onClose: () => void;
  onSuccess: () => void;
}

interface Errores {
  patente?: string;
  kilometraje?: string;
  diagnosticoInicial?: string;
}

export default function ModalNuevaOrden({ vehiculos, onClose, onSuccess }: Props) {
  const [patente, setPatente] = useState("");
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [buscandoVehiculo, setBuscandoVehiculo] = useState(false);
  const [errorVehiculo, setErrorVehiculo] = useState<string | null>(null);
  const [kilometraje, setKilometraje] = useState("");
  const [diagnosticoInicial, setDiagnosticoInicial] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState<Vehiculo[]>([]);

  async function buscarVehiculo() {
    if (!patente.trim()) return;
    setBuscandoVehiculo(true);
    setErrorVehiculo(null);
    setVehiculo(null);

    try {
      const res = await api.get<Vehiculo>(`/api/vehiculos/${patente.toUpperCase()}`);
      setVehiculo(res.data);
    } catch {
      setErrorVehiculo("No se encontró un vehículo con esa patente");
    } finally {
      setBuscandoVehiculo(false);
    }
  }

  function validar(): boolean {
    const nuevosErrores: Errores = {};

    if (!vehiculo) nuevosErrores.patente = "Buscá y seleccioná un vehículo válido";

    const kmNum = parseInt(kilometraje);
    if (!kilometraje || isNaN(kmNum) || kmNum < 0)
      nuevosErrores.kilometraje = "El kilometraje es obligatorio y debe ser mayor o igual a 0";

    if (!diagnosticoInicial.trim())
      nuevosErrores.diagnosticoInicial = "El diagnóstico inicial es obligatorio";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorGeneral(null);
    if (!validar()) return;

    setLoading(true);
    try {
      await api.post("/api/ordenes", {
        patente: patente.toUpperCase(),
        kilometraje: parseInt(kilometraje),
        diagnosticoInicial,
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
        setErrorGeneral(data?.mensaje ?? "No se pudo crear la orden");
      } else {
        setErrorGeneral("No se pudo crear la orden");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (campo: keyof Errores) =>
    `border rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none w-full ${
      errores[campo]
        ? "border-[#EF4444] focus:border-[#EF4444]"
        : "border-[#d1d5db] focus:border-[#E67E22]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">

        {/* Título */}
        <h2 className="text-[#111827] font-bold text-xl mb-1">Nueva Orden de Trabajo</h2>
        <p className="text-[#6b7280] text-sm mb-6">
          Complete los datos para registrar una nueva orden
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Patente */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Patente <span className="text-[#EF4444]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={patente}
                onChange={(e) => {
  const valor = e.target.value.toUpperCase();
  setPatente(valor);
  setVehiculo(null);
  setErrorVehiculo(null);
  if (valor.trim().length > 0) {
    setSugerencias(
      vehiculos.filter((v) =>
        v.patente.startsWith(valor)
      )
    );
  } else {
    setSugerencias([]);
  }
}}
                placeholder="Ej. AAA111"
                maxLength={7}
                className={inputClass("patente")}
              />
              <button
                type="button"
                onClick={buscarVehiculo}
                disabled={buscandoVehiculo}
                className="bg-[#1a2035] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {buscandoVehiculo ? "Buscando..." : "Buscar"}
              </button>
            </div>
            {sugerencias.length > 0 && (
  <ul className="border border-[#d1d5db] rounded-lg bg-white shadow-md mt-1 max-h-40 overflow-y-auto">
    {sugerencias.map((v) => (
      <li
        key={v.patente}
        onClick={() => {
          setPatente(v.patente);
          setVehiculo(v);
          setSugerencias([]);
        }}
        className="px-4 py-2 text-sm text-[#111827] hover:bg-[#f4f5f7] cursor-pointer"
      >
        {v.patente} — {v.marca} {v.modelo} {v.anio}
      </li>
    ))}
  </ul>
)}
            {errores.patente && (
  <div className="flex items-center gap-1 text-[#EF4444] text-xs">
    <AlertCircle size={12} />
    <span>{errores.patente}</span>
  </div>
)}
            {errorVehiculo && (
              <p className="text-[#EF4444] text-xs">{errorVehiculo}</p>
            )}
          </div>

          {/* Info vehículo */}
          {vehiculo && (
            <div className="flex items-start gap-2 bg-[#f4f5f7] text-[#111827] text-sm px-4 py-3 rounded-lg border border-[#d1d5db]">
              <Car size={20} className="shrink-0 mt-0.5 text-[#6b7280]" />
              <div>
                <p className="font-medium">
                  {vehiculo.patente} — {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                </p>
                <p className="text-xs mt-0.5">
                  Cliente: {vehiculo.nombreCliente} {vehiculo.apellidoCliente} · DNI: {vehiculo.dniCliente}
                </p>
              </div>
            </div>
          )}

          {/* Kilometraje */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Kilometraje actual <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={kilometraje}
                onChange={(e) => setKilometraje(e.target.value)}
                placeholder="Ej. 85000"
                min={0}
                className={inputClass("kilometraje")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-xs">
                km
              </span>
            </div>
            {errores.kilometraje && (
  <div className="flex items-center gap-1 text-[#EF4444] text-xs">
    <AlertCircle size={12} />
    <span>{errores.kilometraje}</span>
  </div>
)}
          </div>

          {/* Diagnóstico */}
          <div className="flex flex-col gap-1">
            <label className="text-[#111827] text-sm font-medium">
              Diagnóstico inicial <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              value={diagnosticoInicial}
              onChange={(e) => setDiagnosticoInicial(e.target.value)}
              placeholder="Describa los síntomas o problemas reportados por el cliente..."
              rows={4}
              className={inputClass("diagnosticoInicial")}
            />
            {errores.diagnosticoInicial && (
  <div className="flex items-center gap-1 text-[#EF4444] text-xs">
    <AlertCircle size={12} />
    <span>{errores.diagnosticoInicial}</span>
  </div>
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
              className="bg-[#E67E22] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Orden"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}