import { useState } from "react";
import { Pencil, Power } from "lucide-react";
import { useVehiculos } from "./useVehiculos";
import ModalNuevoVehiculo from "./ModalNuevoVehiculo";
import  ModalEstadoVehiculo from "./ModalEstadoVehiculo";

const estadoBadge: Record<string, string> = {
  ACTIVO: "bg-[#DCFCE7] text-[#166534]",
  INACTIVO: "bg-[#FEE2E2] text-[#991B1B]",
};

export default function Vehiculos() {
  const { vehiculos, loading, error, recargar } = useVehiculos();
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevoVehiculo, setMostrarNuevoVehiculo] = useState(false);
  const [vehiculoEstado, setVehiculoEstado] = useState<typeof vehiculos[0] | null>(null);


  const vehiculosFiltrados = busqueda.trim() === ""
    ? vehiculos
    : vehiculos.filter((v) =>
        v.patente.toLowerCase().includes(busqueda.toLowerCase())
      );

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
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-[#d1d5db] rounded-lg px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#2563EB] w-72"
        />
        <button
  onClick={() => setMostrarNuevoVehiculo(true)}
  className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#10B981] transition-colors"
>
  + Nuevo Vehículo
</button>
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
                  <th className="px-6 py-3 text-center">Patente</th>
                  <th className="px-6 py-3 text-center">Marca</th>
                  <th className="px-6 py-3 text-center">Modelo</th>
                  <th className="px-6 py-3 text-center">Año</th>
                  <th className="px-6 py-3 text-center">Cliente</th>
                  <th className="px-6 py-3 text-center">Estado</th>
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
                      <td className="px-6 py-4 text-center font-medium text-[#111827]">
                        {vehiculo.patente}
                      </td>
                      <td className="px-6 py-4 text-center text-[#111827]">{vehiculo.marca}</td>
                      <td className="px-6 py-4 text-center text-[#111827]">{vehiculo.modelo}</td>
                      <td className="px-6 py-4 text-center text-[#111827]">{vehiculo.anio}</td>
                      <td className="px-6 py-4 text-center text-[#111827]">
                        {vehiculo.nombreCliente} {vehiculo.apellidoCliente}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge[vehiculo.estado]}`}>
                          {vehiculo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
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