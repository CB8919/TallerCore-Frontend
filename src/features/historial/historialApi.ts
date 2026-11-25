import axios from "axios";
import api from "../../services/api";

export type EstadoOrden = "INGRESADO" | "EN_REPARACION" | "FINALIZADO" | "CANCELADO";

export interface OrdenHistorial {
  id: number;
  kilometraje: number | null;
  diagnosticoInicial: string;
  descripcionTrabajo: string | null;
  motivoCancelacion: string | null;
  repuestosUtilizados: string | null;
  estado: EstadoOrden;
  nombreMecanico: string | null;
  fechaIngreso: string;
  fechaFinalizacion: string | null;
}

export interface ClienteContacto {
  telefono: string | null;
}

const ESTADOS_CERRADOS: EstadoOrden[] = ["FINALIZADO", "CANCELADO"];

function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje = (error.response?.data as { mensaje?: string } | undefined)?.mensaje;
    if (mensaje) return mensaje;
  }
  return "";
}

export async function buscarClientePorDni(dni: string): Promise<ClienteContacto> {
  try {
    const { data } = await api.get<ClienteContacto>(`/api/clientes/${encodeURIComponent(dni)}`);
    return data;
  } catch (error) {
    throw new Error(mensajeDeError(error) || "No se pudo cargar el cliente.");
  }
}

export async function obtenerHistorial(patente: string): Promise<OrdenHistorial[]> {
  try {
    const { data } = await api.get<OrdenHistorial[]>(
      `/api/ordenes/historial/${encodeURIComponent(patente)}`,
    );
    return data
      .filter((o) => ESTADOS_CERRADOS.includes(o.estado))
      .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());
  } catch (error) {
    const mensaje = mensajeDeError(error);
    if (mensaje.includes("No se encontró historial")) return [];
    throw new Error(mensaje || "No se pudo cargar el historial.");
  }
}