import { useCallback, useMemo, useRef, useState } from "react";
import { useVehiculos } from "../vehiculos/useVehiculos";
import { buscarClientePorDni, obtenerHistorial, type OrdenHistorial } from "./historialApi";

export type VehiculoLista = ReturnType<typeof useVehiculos>["vehiculos"][number];

const FORMATO_PATENTE = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;
const normalizar = (valor: string) => valor.toUpperCase().replace(/[^A-Z0-9]/g, "");

export function useHistorial() {
  const { vehiculos } = useVehiculos();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<VehiculoLista | null>(null);
  const [telefono, setTelefono] = useState<string | null>(null);
  const [telefonoError, setTelefonoError] = useState(false);
  const [ordenes, setOrdenes] = useState<OrdenHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peticion = useRef(0);

  const limpiarResultado = useCallback(() => {
    peticion.current++;
    setSeleccionado(null);
    setTelefono(null);
    setTelefonoError(false);
    setOrdenes([]);
    setError(null);
    setLoading(false);
  }, []);

  const seleccionar = useCallback(async (vehiculo: VehiculoLista) => {
    const id = ++peticion.current;
    setSeleccionado(vehiculo);
    setBusqueda(vehiculo.patente);
    setLoading(true);
    setError(null);
    setOrdenes([]);
    setTelefono(null);
    setTelefonoError(false);

    const [historial, cliente] = await Promise.allSettled([
      obtenerHistorial(vehiculo.patente),
      buscarClientePorDni(vehiculo.dniCliente),
    ]);
    if (id !== peticion.current) return; // respuesta vieja: se descarta

    if (historial.status === "fulfilled") setOrdenes(historial.value);
    else setError(historial.reason instanceof Error ? historial.reason.message : "Error inesperado.");

    if (cliente.status === "fulfilled") setTelefono(cliente.value.telefono);
    else setTelefonoError(true);

    setLoading(false);
  }, []);

  const cambiarBusqueda = useCallback(
    (valor: string) => {
      setBusqueda(valor);
      if (seleccionado) limpiarResultado();
    },
    [seleccionado, limpiarResultado],
  );

  const buscarPatente = useCallback(() => {
    const normalizada = normalizar(busqueda);
    if (!FORMATO_PATENTE.test(normalizada)) return;

    const exacto = vehiculos.find((v) => normalizar(v.patente) === normalizada);
    if (exacto) void seleccionar(exacto);
  }, [busqueda, vehiculos, seleccionar]);

  const volver = useCallback(() => {
    limpiarResultado();
    setBusqueda("");
  }, [limpiarResultado]);

  const coincidencias = useMemo(() => {
    const q = normalizar(busqueda);
    if (!q || seleccionado) return [];
    return vehiculos.filter((v) => normalizar(v.patente).includes(q)).slice(0, 8);
  }, [busqueda, seleccionado, vehiculos]);

  const mensajeBusqueda = useMemo(() => {
    const q = normalizar(busqueda);
    if (!q || seleccionado || coincidencias.length > 0) return null;
    if (FORMATO_PATENTE.test(q)) return "La patente no está registrada.";
    return q.length >= 6 ? "Formato de patente inválido." : "Sin coincidencias.";
  }, [busqueda, seleccionado, coincidencias]);

  // El historial viene ordenado del más reciente al más antiguo
  const kilometrajeActual = ordenes[0]?.kilometraje ?? null;

  return {
    busqueda, cambiarBusqueda, buscarPatente, coincidencias, mensajeBusqueda,
    seleccionado, seleccionar, telefono, telefonoError, ordenes,
    loading, error, kilometrajeActual, volver,
  };
}