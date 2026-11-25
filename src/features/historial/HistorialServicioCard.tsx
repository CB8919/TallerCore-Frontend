import type { OrdenHistorial } from "./historialApi";

const formatearFecha = (iso: string | null): string => {
  if (!iso) return "—";
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "—" : fecha.toLocaleString("es-AR");
};

export default function HistorialServicioCard({ ordenes }: { ordenes: OrdenHistorial[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db]">
      <div className="px-6 py-4 border-b border-[#d1d5db]">
        <h2 className="text-[#111827] text-base font-semibold">Historial de servicio</h2>
      </div>

      {ordenes.length === 0 ? (
        <p className="px-6 py-8 text-center text-[#6b7280] text-sm">
          Este vehículo todavía no tiene servicios finalizados o cancelados
        </p>
      ) : (
        <ul>
          {ordenes.map((o) => {
            const cancelada = o.estado === "CANCELADO";
            return (
              <li
                key={o.id}
                className="px-6 py-4 border-b border-[#d1d5db] last:border-0 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <p className="sm:col-span-2 text-[#111827] text-sm font-medium">
                  OT-{String(o.id).padStart(4, "0")}
                </p>
                <Campo etiqueta="Ingreso" valor={formatearFecha(o.fechaIngreso)} />
                <Campo etiqueta="Salida" valor={formatearFecha(o.fechaFinalizacion)} />
                <Campo etiqueta="Motivo de ingreso" valor={o.diagnosticoInicial} ancho />
                <Campo
                  etiqueta={cancelada ? "Motivo de cancelación" : "Trabajo realizado"}
                  valor={(cancelada ? o.motivoCancelacion : o.descripcionTrabajo) || "—"}
                  ancho
                />
                <Campo etiqueta="Mecánico" valor={o.nombreMecanico ?? "Sin asignar"} />
                <Campo
                  etiqueta="Kilómetros"
                  valor={o.kilometraje !== null ? `${o.kilometraje.toLocaleString("es-AR")} km` : "—"}
                />
                <Campo etiqueta="Repuestos" valor={o.repuestosUtilizados?.trim() || "Sin repuestos"} ancho />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Campo({ etiqueta, valor, ancho = false }: { etiqueta: string; valor: string; ancho?: boolean }) {
  return (
    <div className={ancho ? "sm:col-span-2" : ""}>
      <p className="text-[#6b7280] text-xs uppercase tracking-wider">{etiqueta}</p>
      <p className="text-[#111827] text-sm mt-1 whitespace-pre-line">{valor}</p>
    </div>
  );
}