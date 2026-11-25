import { useHistorial } from "./useHistorial";
import VehiculoClienteCard from "./VehiculoClienteCard";
import HistorialServicioCard from "./HistorialServicioCard";

export default function Historial() {
  const h = useHistorial();

  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-[#111827] text-2xl font-semibold">Historial</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Consulta el historial de servicio de un vehículo
        </p>
      </div>

      {/* Buscador */}
      <div className="flex items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            h.buscarPatente();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por patente..."
              aria-label="Buscar por patente"
              value={h.busqueda}
              onChange={(e) => h.cambiarBusqueda(e.target.value)}
              maxLength={10}
              autoComplete="off"
              className="border border-[#d1d5db] rounded-lg px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#F5A623] w-72"
            />

            {h.coincidencias.length > 0 && (
              <ul className="absolute z-10 mt-1 w-96 bg-white rounded-lg shadow-sm border border-[#d1d5db] overflow-hidden">
                {h.coincidencias.map((v) => (
                  <li key={v.patente}>
                    <button
                      type="button"
                      onClick={() => void h.seleccionar(v)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-[#f4f5f7] transition-colors"
                    >
                      <span className="text-[#111827] font-medium">{v.patente}</span>
                      <span className="text-[#6b7280]">
                        {v.marca} {v.modelo} · {v.nombreCliente} {v.apellidoCliente}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {h.seleccionado && (
            <button
              type="button"
              onClick={h.volver}
              className="inline-flex h-10 w-28 items-center justify-center whitespace-nowrap rounded-lg bg-[#374151] text-sm font-medium text-white transition-colors hover:bg-[#4b5563] active:bg-[#6b7280] focus-visible:outline-none"
            >
              Limpiar
            </button>
          )}
        </form>
      </div>

      {h.mensajeBusqueda && <p className="text-[#6b7280] text-sm">{h.mensajeBusqueda}</p>}

      {/* Resultado */}
      {h.seleccionado && (
        <>
          <VehiculoClienteCard
            vehiculo={h.seleccionado}
            telefono={h.telefono}
            telefonoError={h.telefonoError}
            kilometraje={h.kilometrajeActual}
            loading={h.loading}
          />
          {h.loading && <p className="text-[#6b7280] text-sm">Cargando historial...</p>}
          {h.error && <p className="text-[#EF4444] text-sm">{h.error}</p>}
          {!h.loading && !h.error && <HistorialServicioCard ordenes={h.ordenes} />}
        </>
      )}
    </div>
  );
}