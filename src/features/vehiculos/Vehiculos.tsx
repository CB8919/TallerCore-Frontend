import { useState } from "react";
import { Power } from "lucide-react";
import { useVehiculos } from "./useVehiculos";
import ModalNuevoVehiculo from "./ModalNuevoVehiculo";
import  ModalEstadoVehiculo from "./ModalEstadoVehiculo";
import { useAuth } from "../../context/AuthContext";

const estadoBadge: Record<string, string> = {
  ACTIVO: "bg-[#DCFCE7] text-[#166534]",
  INACTIVO: "bg-[#FEE2E2] text-[#991B1B]",
};

export default function Vehiculos() {
  const { vehiculos, loading, error, recargar } = useVehiculos();
  const { user } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarNuevoVehiculo, setMostrarNuevoVehiculo] = useState(false);
  const [vehiculoEstado, setVehiculoEstado] = useState<typeof vehiculos[0] | null>(null);
  const esMecanico = user?.rol === "MECANICO";

  const sugerenciasPatentes = mostrarSugerencias && busqueda.trim()
    ? vehiculos
        .filter((vehiculo) =>
          vehiculo.patente.toUpperCase().includes(busqueda.trim().toUpperCase())
        )
        .slice(0, 8)
    : [];

  const vehiculosFiltrados = busqueda.trim() === ""
    ? vehiculos
    : vehiculos.filter((v) =>
        v.patente.toLowerCase().includes(busqueda.trim().toLowerCase())
      );

  function limpiarBusqueda() {
    setBusqueda("");
    setMostrarSugerencias(false);
  }

  function seleccionarPatente(patente: string) {
    setBusqueda(patente);
    setMostrarSugerencias(false);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-[#111827] text-2xl font-semibold">Vehículos</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Gestiona los vehículos registrados en el taller
        </p>
      </div>

      {/* Buscador y botón */}
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
              placeholder="Buscar por patente..."
              aria-label="Buscar vehículo por patente"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              autoComplete="off"
              className="border border-[#d1d5db] rounded-lg px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#2563EB] w-72"
            />
            {sugerenciasPatentes.length > 0 && (
              <ul className="absolute z-10 mt-1 w-96 bg-white rounded-lg shadow-sm border border-[#d1d5db] overflow-hidden">
                {sugerenciasPatentes.map((vehiculo) => (
                  <li key={vehiculo.patente}>
                    <button
                      type="button"
                      onClick={() => seleccionarPatente(vehiculo.patente)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-[#f4f5f7] transition-colors"
                    >
                      <span className="text-[#111827] font-medium">{vehiculo.patente}</span>
                      <span className="text-[#6b7280]">
                        {vehiculo.marca} {vehiculo.modelo}
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
              className="inline-flex h-10 w-28 items-center justify-center whitespace-nowrap rounded-lg bg-green-700 text-sm font-medium text-white transition-colors hover:bg-[#10B981]"
            >
              Limpiar
            </button>
          )}
        </form>
        {!esMecanico && (
        <button
  onClick={() => setMostrarNuevoVehiculo(true)}
  className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#10B981] transition-colors"
>
  + Nuevo Vehículo
</button>
)}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db]">
        {loading && (
          <p className="text-[#6b7280] text-sm px-6 py-8">Cargando vehículos...</p>
        )}

        {error && (
          <p className="text-[#EF4444] text-sm px-6 py-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#6b7280] text-xs uppercase tracking-wider border-b border-[#d1d5db]">
                  <th className="px-6 py-3 text-left">Patente</th>
                  <th className="px-6 py-3 text-left">Marca</th>
                  <th className="px-6 py-3 text-left">Modelo</th>
                  <th className="px-6 py-3 text-left">Año</th>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#6b7280] text-sm">
                      No se encontraron vehículos con esa patente
                    </td>
                  </tr>
                ) : (
                  vehiculosFiltrados.map((vehiculo) => (
                    <tr
                      key={vehiculo.patente}
                      className="border-b border-[#d1d5db] last:border-0 hover:bg-[#f4f5f7] transition-colors"
                    >
                      <td className="px-6 py-4 text-left font-medium text-[#111827]">
                        {vehiculo.patente}
                      </td>
                      <td className="px-6 py-4 text-left text-[#111827]">{vehiculo.marca}</td>
                      <td className="px-6 py-4 text-left text-[#111827]">{vehiculo.modelo}</td>
                      <td className="px-6 py-4 text-left text-[#111827]">{vehiculo.anio}</td>
                      <td className="px-6 py-4 text-left text-[#111827]">
                        {vehiculo.nombreCliente} {vehiculo.apellidoCliente}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className={`px-3 py-1 rounded-md text-xs font-medium ${estadoBadge[vehiculo.estado]}`}>
                          {vehiculo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!esMecanico && (
  <div className="flex justify-center">
    <button
      onClick={() => setVehiculoEstado(vehiculo)}
      className={`cursor-pointer transition-colors ${
        vehiculo.estado === "ACTIVO"
          ? "text-[#EF4444] hover:text-red-700"
          : "text-[#22C55E] hover:text-green-700"
      }`}
    >
      <Power size={16} />
    </button>
  </div>
                        )}
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
                    {mostrarNuevoVehiculo && (
  <ModalNuevoVehiculo
    onClose={() => setMostrarNuevoVehiculo(false)}
    onSuccess={() => {
      setMostrarNuevoVehiculo(false);
      recargar();
    }}
  />
)}

        {vehiculoEstado && (
  <ModalEstadoVehiculo
    patente={vehiculoEstado.patente}
    marca={vehiculoEstado.marca}
    modelo={vehiculoEstado.modelo}
    estadoActual={vehiculoEstado.estado}
    onClose={() => setVehiculoEstado(null)}
    onSuccess={() => {
      setVehiculoEstado(null);
      recargar();
    }}
  />
)}
    </div>
  );
}