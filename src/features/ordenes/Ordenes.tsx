import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { useOrdenes } from "./useOrdenes";
import ModalNuevaOrden from "./ModalNuevaOrden";
import ModalGestionOrden from "./ModalGestionOrden";
import { useVehiculos } from "../vehiculos/useVehiculos";
import { useAuth } from "../../context/AuthContext";

const estadoBadge: Record<string, string> = {
  EN_REPARACION: "bg-[#FEF3C7] text-[#92400E]",
  INGRESADO: "bg-[#DBEAFE] text-[#1E40AF]",
  FINALIZADO: "bg-[#DCFCE7] text-[#166534]",
  CANCELADO: "bg-[#FEE2E2] text-[#991B1B]",
};

const estadoLabel: Record<string, string> = {
  EN_REPARACION: "EN REPARACIÓN",
  INGRESADO: "INGRESADO",
  FINALIZADO: "FINALIZADO",
  CANCELADO: "CANCELADO",
};

export default function Ordenes() {
  const { ordenes, loading, error, recargar } = useOrdenes();
  const [busqueda, setBusqueda] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarNuevaOrden, setMostrarNuevaOrden] = useState(false);
  const { vehiculos } = useVehiculos();
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<typeof ordenes[0] | null>(null);
  const { user } = useAuth();
  const puedeCrearOrden =
  user?.rol === "ADMIN" || user?.rol === "ADMIN_MECANICO";

  const ordenesFiltradas = busqueda.trim() === ""
    ? ordenes
    : ordenes.filter((o) =>
        o.patenteVehiculo.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
        String(o.id).includes(busqueda.trim())
      );

  const sugerenciasPatentes = mostrarSugerencias && busqueda.trim()
    ? Array.from(
        new Map(
          ordenes
            .filter((o) => o.patenteVehiculo.toUpperCase().includes(busqueda.trim().toUpperCase()))
            .map((o) => [o.patenteVehiculo, o] as const),
        ).values(),
      ).slice(0, 8)
    : [];

  function seleccionarPatente(patente: string) {
    setBusqueda(patente);
    setMostrarSugerencias(false);
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setMostrarSugerencias(false);
  }



  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-[#111827] text-2xl font-semibold">Órdenes de Trabajo</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Gestiona las órdenes de trabajo del taller
        </p>
      </div>

      {/* Buscador y botones */}
      <div className="flex items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMostrarSugerencias(false);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por patente o ID..."
              aria-label="Buscar orden por patente o ID"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              className="border border-[#d1d5db] rounded-lg px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#F5A623] w-72"
            />
            {sugerenciasPatentes.length > 0 && (
              <ul className="absolute z-10 mt-1 w-96 bg-white rounded-lg shadow-sm border border-[#d1d5db] overflow-hidden">
                {sugerenciasPatentes.map((orden) => (
                  <li key={orden.patenteVehiculo}>
                    <button
                      type="button"
                      onClick={() => seleccionarPatente(orden.patenteVehiculo)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-[#f4f5f7] transition-colors"
                    >
                      <span className="text-[#111827] font-medium">{orden.patenteVehiculo}</span>
                      <span className="text-[#6b7280]">
                        {orden.marcaVehiculo} {orden.modeloVehiculo}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {busqueda.trim() && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="inline-flex h-10 w-28 items-center justify-center whitespace-nowrap rounded-lg bg-[#E67E22] text-sm font-medium text-white transition-colors hover:bg-orange-400"
            >
              Limpiar
            </button>
          )}
        </form>
        <div className="flex items-center gap-3">

          {puedeCrearOrden && (
          <button
  onClick={() => setMostrarNuevaOrden(true)}
  className="bg-[#E67E22] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors"
>
  + Nueva Orden
</button>
)}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db]">
        {loading && (
          <p className="text-[#6b7280] text-sm px-6 py-8">Cargando órdenes...</p>
        )}

        {error && (
          <p className="text-[#EF4444] text-sm px-6 py-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#6b7280] text-xs uppercase tracking-wider border-b border-[#d1d5db]">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Vehículo</th>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Mecánico</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Fecha Ingreso</th>
                  <th className="px-6 py-3 text-center">Actualizar</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#6b7280] text-sm">
                      No se encontraron órdenes
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((orden) => (
                    <tr
                      key={orden.id}
                      className="border-b border-[#d1d5db] last:border-0 hover:bg-[#f4f5f7] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-left text-[#111827]">
                        OT-{String(orden.id).padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4 text-left text-[#111827]">
                        <p>{orden.patenteVehiculo} - {orden.marcaVehiculo} {orden.modeloVehiculo} {orden.anioVehiculo}</p>

                      </td>
                      <td className="px-6 py-4 text-left text-[#111827]">
                        {orden.nombreCliente} {orden.apellidoCliente}
                      </td>
                      <td className="px-6 py-4 text-left text-[#111827]">
                        {orden.nombreMecanico ?? "Sin asignar"}
                      </td>
                      <td className="px-6 py-4 text-left text-[#111827]">
                        <span className={`px-3 py-1 rounded-md text-xs font-medium ${estadoBadge[orden.estado]}`}>
                          {estadoLabel[orden.estado]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left text-[#6b7280]">
                        {new Date(orden.fechaIngreso).toLocaleString("es-AR")}
                      </td>
                      <td className="px-6 py-4">
  <div className="flex justify-center">
    <button
      type="button"
      onClick={() => setOrdenSeleccionada(orden)}
      className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-[#E67E22]/30 bg-orange-50/70 px-3 py-1.5 text-xs font-medium text-[#E67E22] transition-colors hover:bg-orange-100 hover:text-orange-600"
    >
      {orden.estado === "FINALIZADO" || orden.estado === "CANCELADO"
        ? <Eye size={15} />
        : <Pencil size={15} />}
      <span>
        {orden.estado === "FINALIZADO" || orden.estado === "CANCELADO" ? "Ver" : "Editar"}
      </span>
    </button>
  </div>
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {puedeCrearOrden && mostrarNuevaOrden && (
  <ModalNuevaOrden
  vehiculos={vehiculos}
  onClose={() => setMostrarNuevaOrden(false)}
  onSuccess={() => {
    setMostrarNuevaOrden(false);
    recargar();
  }}
/>
)}
          {ordenSeleccionada && (
  <ModalGestionOrden
    orden={ordenSeleccionada}
    onClose={() => setOrdenSeleccionada(null)}
    onSuccess={() => {
      setOrdenSeleccionada(null);
      recargar();
    }}
  />
)}
    </div>
  );
}