import { Car } from "lucide-react";
import type { VehiculoLista } from "./useHistorial";

interface Props {
  vehiculo: VehiculoLista;
  telefono: string | null;
  telefonoError: boolean;
  kilometraje: number | null;
  loading: boolean;
}

export default function VehiculoClienteCard({ vehiculo, telefono, telefonoError, kilometraje, loading }: Props) {
  const telefonoTexto = telefonoError
    ? "No disponible"
    : telefono || (loading ? "..." : "Sin teléfono");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#d1d5db] p-6 flex flex-col sm:flex-row gap-6">
      <div
        className="bg-[#f4f5f7] rounded-lg w-full sm:w-48 h-32 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Car size={56} className="text-[#6b7280]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
        <Dato etiqueta="Vehículo" valor={`${vehiculo.marca} ${vehiculo.modelo}`} />
        <Dato etiqueta="Patente" valor={vehiculo.patente} />
        <Dato etiqueta="Año" valor={String(vehiculo.anio)} />
        <Dato
          etiqueta="Km actual"
          valor={kilometraje !== null ? `${kilometraje.toLocaleString("es-AR")} km` : "—"}
        />
        <Dato etiqueta="Cliente" valor={`${vehiculo.nombreCliente} ${vehiculo.apellidoCliente}`} />
        <Dato etiqueta="Teléfono" valor={telefonoTexto} />
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <p className="text-[#6b7280] text-xs uppercase tracking-wider">{etiqueta}</p>
      <p className="text-[#111827] text-sm font-medium mt-1">{valor}</p>
    </div>
  );
}