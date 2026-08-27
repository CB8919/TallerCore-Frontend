import { useClientes } from "./useClientes";
import { useState } from "react";
import { Pencil } from "lucide-react";
import ModalEditarContacto from "./ModalEditarContacto";
import ModalEstadoCliente from "./ModalEstadoCliente";
import ModalNuevoCliente from "./ModalNuevoCliente";
import { Power } from "lucide-react";

const estadoBadge: Record<string, string> = {
  ACTIVO: "bg-[#DCFCE7] text-[#166534]",
  INACTIVO: "bg-[#FEE2E2] text-[#991B1B]",
};

export default function Clientes() {
  const { clientes, loading, error, recargar } = useClientes();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<typeof clientes[0] | null>(null);
  const [ clienteEstado, setClienteEstado ] = useState<typeof clientes[0] | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);

  const clientesFiltrados = clientes.filter((c) =>
    c.dni.includes(busqueda.trim())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-[#111827] text-2xl font-semibold">Clientes</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Gestiona los clientes registrados en el taller
        </p>
      </div>

      {/* Buscador y botón */}
      <div className="flex items-center justify-between gap-4">
        <input
              type="text"
              placeholder="Buscar por DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-[#d1d5db] rounded-lg px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280]           focus:outline-none focus:border-[#2563EB] w-72"
          />
        {busqueda.trim().length > 8 && (
  <p className="text-[#EF4444] text-xs mt-1">
    El DNI debe contener exactamente 8 dígitos
  </p>
)}
        <button 
          className="cursor-pointer bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setMostrarNuevoCliente(true)}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db]">
        {loading && (
          <p className="text-[#6b7280] text-sm px-6 py-8">Cargando clientes...</p>
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
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">DNI</th>
                  <th className="px-6 py-3 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Vehículos</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-[#d1d5db] last:border-0 hover:bg-[#f4f5f7] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      #{cliente.id}
                    </td>
                    <td className="px-6 py-4 text-[#111827]">
                      {cliente.nombre} {cliente.apellido}
                    </td>
                    <td className="px-6 py-4 text-[#111827]">{cliente.dni}</td>
                    <td className="px-6 py-4 text-[#111827]">{cliente.telefono}</td>
                    <td className="px-6 py-4 text-[#111827]">{cliente.email}</td>
                    <td className="px-6 py-4 text-[#111827]">{cliente.totalVehiculos}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge[cliente.estado]}`}
                      >
                        {cliente.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <button
                        onClick={() => setClienteSeleccionado(cliente)}
                        className="cursor-pointer text-[#2563EB] hover:text-blue-700 transition-colors"
                        >
                        <Pencil size={16} />
                        </button>

                        <button
                              onClick={() => setClienteEstado(cliente)}
                              className={`cursor-pointer transition-colors ${
                              cliente.estado === "ACTIVO"
                              ? "text-[#EF4444] hover:text-red-700"
                              : "text-[#22C55E] hover:text-green-700"
                              } ml-4`}
                              >
                              <Power size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {clientesFiltrados.length === 0 && busqueda.trim().length === 8 && !loading && (
  <tr>
    <td colSpan={8} className="px-6 py-8 text-center text-[#6b7280] text-sm">
      No se encontraron clientes con ese DNI
    </td>
  </tr>
)}
            </table>
          </div>
        )}
      </div>
      {clienteSeleccionado && (
        <ModalEditarContacto
            dni={clienteSeleccionado.dni}
            telefonoActual={clienteSeleccionado.telefono}
            emailActual={clienteSeleccionado.email}
            onClose={() => setClienteSeleccionado(null)}
            onSuccess={() => {
            setClienteSeleccionado(null);
            recargar();
            }}
            />
      )}
      {clienteEstado && (
          <ModalEstadoCliente
            dni={clienteEstado.dni}
            nombre={clienteEstado.nombre}
            apellido={clienteEstado.apellido}
            estadoActual={clienteEstado.estado}
            onClose={() => setClienteEstado(null)}
            onSuccess={() => {
            setClienteEstado(null);
            recargar();
          }}
      />
      )}

      {mostrarNuevoCliente && (
          <ModalNuevoCliente
            onClose={() => setMostrarNuevoCliente(false)}
            onSuccess={() => {
            setMostrarNuevoCliente(false);
            recargar();
          }}
      />
      )}
  
    </div>
    
  );
}