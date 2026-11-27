import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Orden {
  id: number;
  patenteVehiculo: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anioVehiculo: number;
  nombreCliente: string;
  apellidoCliente: string;
  dniCliente: string;
  diagnosticoInicial: string;
  nombreMecanico: string | null;
  estado: string;
  fechaIngreso: string;
  descripcionTrabajo: string | null;
  repuestosUtilizados: string | null;
  motivoCancelacion: string | null;
}

interface Mecanico {
  dni: string;
  nombre: string;
  apellido: string;
  rol: string;
}

interface Props {
  orden: Orden;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalGestionOrden({ orden, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const puedeAsignarMecanico = user?.rol === "ADMIN" || user?.rol === "ADMIN_MECANICO";
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState("");
  const [repuestosUtilizados, setRepuestosUtilizados] = useState("");
  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [accion, setAccion] = useState<"finalizar" | "cancelar" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!puedeAsignarMecanico || orden.estado !== "INGRESADO") return;

    api.get<Mecanico[]>("/api/usuarios")
      .then((res) => {
        const filtrados = res.data.filter(
          (u) => u.rol === "MECANICO" || u.rol === "ADMIN_MECANICO"
        );
        setMecanicos(filtrados);
      })
      .catch(() => setError("No se pudieron cargar los mecánicos"));
  }, [orden.estado, puedeAsignarMecanico]);

  async function handleAsignar() {
    if (!mecanicoSeleccionado) {
      setError("Seleccioná un mecánico");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.patch(`/api/ordenes/${orden.id}/mecanico?dniMecanico=${mecanicoSeleccionado}`);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
        setError(data?.mensaje ?? "No se pudo asignar el mecánico");
      } else {
        setError("No se pudo asignar el mecánico");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalizar() {
    if (!descripcionTrabajo.trim()) {
      setError("La descripción del trabajo es obligatoria");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const parametros = new URLSearchParams({ descripcionTrabajo });
      if (repuestosUtilizados.trim()) {
        parametros.set("repuestosUtilizados", repuestosUtilizados);
      }
      await api.patch(`/api/ordenes/${orden.id}/finalizar?${parametros.toString()}`);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
        setError(data?.mensaje ?? "No se pudo finalizar la orden");
      } else {
        setError("No se pudo finalizar la orden");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar() {
    if (!motivoCancelacion.trim()) {
      setError("El motivo de cancelación es obligatorio");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.patch(`/api/ordenes/${orden.id}/cancelar?motivoCancelacion=${encodeURIComponent(motivoCancelacion)}`);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data;
        setError(data?.mensaje ?? "No se pudo cancelar la orden");
      } else {
        setError("No se pudo cancelar la orden");
      }
    } finally {
      setLoading(false);
    }
  }

  const esFinalOCancelado = orden.estado === "FINALIZADO" || orden.estado === "CANCELADO";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">

        {/* Título */}
        <h2 className="text-[#111827] font-bold text-xl mb-1">
          Gestión de Estado y Asignación
        </h2>
        <p className="text-[#6b7280] text-sm mb-4">
          Gestioná el estado y la asignación de la orden de trabajo
        </p>

        {/* Info orden */}
        <div className="bg-[#f4f5f7] border border-[#d1d5db] rounded-lg px-4 py-3 mb-6">
          <p className="text-[#111827] font-semibold text-sm">
            Orden #{String(orden.id).padStart(4, "0")} — {orden.patenteVehiculo}
          </p>
          <p className="text-[#6b7280] text-xs mt-1">
            {orden.marcaVehiculo} {orden.modeloVehiculo} {orden.anioVehiculo}
          </p>
          <p className="text-[#6b7280] text-xs">
            Cliente: {orden.nombreCliente} {orden.apellidoCliente} · DNI: {orden.dniCliente}
          </p>
          {["EN_REPARACION", "FINALIZADO", "CANCELADO"].includes(orden.estado) && (
            <p className="mt-2 text-[#111827] text-xs">
              <span className="font-semibold">Mecánico asignado:</span>{" "}
              {orden.nombreMecanico ?? "Sin asignar"}
            </p>
          )}
          <p className="text-[#111827] text-xs mt-2">
  <span className="font-semibold">Diagnóstico inicial:</span>{" "}
  {orden.diagnosticoInicial}
</p>
        </div>

        {/* Flujo de estados */}
        <div className="flex items-center gap-2 mb-6">
          {["INGRESADO", "EN_REPARACION", orden.estado === "CANCELADO" ? "CANCELADO" : "FINALIZADO"].map((estado, i) => (
  <div key={estado} className="flex items-center gap-2">
    <span className={`px-3 py-1 rounded-md text-xs font-medium ${
      orden.estado === estado
        ? orden.estado === "CANCELADO"
          ? "bg-[#EF4444] text-white"
          : orden.estado === "FINALIZADO"
            ? "bg-[#DCFCE7] text-[#166534]"
            : "bg-[#E67E22] text-white"
        : "bg-[#f4f5f7] text-[#6b7280]"
    }`}>
      {estado === "EN_REPARACION" ? "EN REPARACIÓN" : estado}
    </span>
    {i < 2 && <span className="text-[#6b7280] text-xs">→</span>}
  </div>
))}
        </div>

        {esFinalOCancelado ? (
  <div className="flex flex-col items-center gap-4 py-4">
    <p className="text-[#6b7280] text-sm text-center">
  Esta orden ya fue {orden.estado === "FINALIZADO" ? "finalizada" : "cancelada"}.
</p>
{orden.estado === "FINALIZADO" && (orden.repuestosUtilizados || orden.descripcionTrabajo) && (
  <div className="bg-[#DCFCE7] border border-[#22C55E] rounded-lg px-4 py-3 text-sm w-full">
    {orden.repuestosUtilizados && (
      <>
        <p className="font-medium text-[#166534] mb-1">Repuestos utilizados:</p>
        <p className="text-[#166534] mb-3">{orden.repuestosUtilizados}</p>
      </>
    )}
    {orden.descripcionTrabajo && (
      <>
        <p className="font-medium text-[#166534] mb-1">Descripción del trabajo:</p>
        <p className="text-[#166534]">{orden.descripcionTrabajo}</p>
      </>
    )}
  </div>
)}
{orden.estado === "CANCELADO" && orden.motivoCancelacion && (
  <div className="bg-[#FEE2E2] border border-[#EF4444] rounded-lg px-4 py-3 text-sm w-full">
    <p className="font-medium text-[#991B1B] mb-1">Motivo de cancelación:</p>
    <p className="text-[#991B1B]">{orden.motivoCancelacion}</p>
  </div>
)}
    <button
      onClick={onClose}
      className="text-sm border border-[#d1d5db] text-[#6b7280] hover:text-[#111827] px-4 py-2 rounded-lg transition-colors"
    >
      Cerrar
    </button>
  </div>
) : (
          <div className="flex flex-col gap-4">

            {/* Asignar mecánico */}
            {orden.estado === "INGRESADO" && puedeAsignarMecanico && (
              <div className="flex flex-col gap-1">
                <label className="text-[#111827] text-sm font-medium">
                  Asignar Mecánico <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={mecanicoSeleccionado}
                  onChange={(e) => setMecanicoSeleccionado(e.target.value)}
                  className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#E67E22]"
                >
                  <option value="">No asignado</option>
                  {mecanicos.map((m) => (
                    <option key={m.dni} value={m.dni}>
                      {m.rol === "ADMIN_MECANICO" ? "Admin_Mecánico" : "Mecánico"}: {m.nombre} {m.apellido}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Finalizar */}
            {orden.estado === "EN_REPARACION" && accion === "finalizar" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[#111827] text-sm font-medium">
                    Repuestos utilizados (opcional)
                  </label>
                  <textarea
                    value={repuestosUtilizados}
                    onChange={(e) => setRepuestosUtilizados(e.target.value)}
                    placeholder="Indicá los repuestos utilizados..."
                    rows={2}
                    className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#E67E22]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#111827] text-sm font-medium">
                    Descripción del trabajo <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    value={descripcionTrabajo}
                    onChange={(e) => setDescripcionTrabajo(e.target.value)}
                    placeholder="Describí el trabajo realizado..."
                    rows={3}
                    className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#E67E22]"
                  />
                </div>
              </>
            )}

            {/* Cancelar */}
            {orden.estado === "EN_REPARACION" && accion === "cancelar" && (
              <div className="flex flex-col gap-1">
                <label className="text-[#111827] text-sm font-medium">
                  Motivo de cancelación <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Indicá el motivo de cancelación..."
                  rows={3}
                  className="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#EF4444]"
                />
              </div>
            )}

            {error && <p className="text-[#EF4444] text-sm">{error}</p>}

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-sm border border-[#d1d5db] text-[#6b7280] hover:text-[#111827] px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              {orden.estado === "INGRESADO" && puedeAsignarMecanico && (
                <button
                  type="button"
                  onClick={handleAsignar}
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#E67E22] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  <UserCheck size={16} />
                  {loading ? "Procesando..." : "Confirmar Asignación"}
                </button>
              )}

              {orden.estado === "EN_REPARACION" && accion !== "cancelar" && (
                <button
                  type="button"
                  onClick={() => accion === "finalizar" ? handleFinalizar() : setAccion("finalizar")}
                  disabled={loading}
                  className="bg-[#22C55E] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Procesando..." : accion === "finalizar" ? "Confirmar Finalización" : "Avanzar a: FINALIZADO"}
                </button>
              )}

              {orden.estado === "EN_REPARACION" && accion !== "finalizar" && (
                <button
                  type="button"
                  onClick={() => accion === "cancelar" ? handleCancelar() : setAccion("cancelar")}
                  disabled={loading}
                  className="bg-[#EF4444] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Procesando..." : accion === "cancelar" ? "Confirmar Cancelación" : "Avanzar a: CANCELADO"}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}