import { useDashboard } from "./useDashboard";

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

export default function Dashboard() {
  const { ordenes, loading, error } = useDashboard();

  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-[#111827] text-2xl font-semibold">
          Panel de Control
        </h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Resumen general del taller
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db]">
        <div className="px-6 py-4 border-b border-[#d1d5db]">
          <h2 className="text-[#111827] font-semibold text-base">
            Últimas órdenes activas
          </h2>
        </div>

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
                  <th className="px-6 py-3 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr
                    key={orden.id}
                    className="border-b border-[#d1d5db] last:border-0 hover:bg-[#f4f5f7] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      #{orden.id}
                    </td>
                    <td className="px-6 py-4 text-[#111827]">
                      <p>{orden.marcaVehiculo} {orden.modeloVehiculo} {orden.anioVehiculo}</p>
                      <p className="text-[#6b7280] text-xs">{orden.patenteVehiculo}</p>
                    </td>
                    <td className="px-6 py-4 text-[#111827]">
                      <p>{orden.nombreCliente} {orden.apellidoCliente}</p>
                    </td>
                    <td className="px-6 py-4 text-[#111827]">
                      {orden.nombreMecanico ?? "Sin asignar"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge[orden.estado]}`}
                      >
                        {estadoLabel[orden.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">
                      {orden.fechaIngreso}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}