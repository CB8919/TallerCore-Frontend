import axios from "axios";
import api from "../../services/api";

export type EstadoUsuario = "ACTIVO" | "INACTIVO";
export type RolUsuario = "ADMIN" | "MECANICO" | "ADMIN_MECANICO";

export interface Usuario {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}

export function mensajeError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const mensaje = (error.response?.data as { mensaje?: string } | undefined)?.mensaje;
    if (mensaje) return mensaje;
  }
  return fallback;
}

export async function listarUsuarios(estado: EstadoUsuario): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>("/api/usuarios", { params: { estado } });
  return data;
}

export async function crearUsuario(usuario: {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: RolUsuario;
}): Promise<void> {
  await api.post("/api/usuarios", usuario);
}

export async function cambiarRolUsuario(dni: string, rol: RolUsuario): Promise<void> {
  await api.patch(`/api/usuarios/${encodeURIComponent(dni)}/rol`, null, {
    params: { nuevoRol: rol },
  });
}

export async function cambiarEstadoUsuario(
  dni: string,
  nuevoEstado: EstadoUsuario,
): Promise<void> {
  const accion = nuevoEstado === "ACTIVO" ? "activar" : "desactivar";
  await api.patch(`/api/usuarios/${encodeURIComponent(dni)}/${accion}`);
}

export async function resetearPasswordUsuario(dni: string, password: string): Promise<void> {
  await api.patch(`/api/usuarios/${encodeURIComponent(dni)}/password`, null, {
    params: { nuevaPassword: password },
  });
}

export async function cambiarMiEmailUsuario(nuevoEmail: string): Promise<void> {
  await api.patch("/api/usuarios/perfil/email", null, {
    params: { nuevoEmail },
  });
}

export async function cambiarMiPasswordUsuario(
  passwordActual: string,
  nuevaPassword: string,
): Promise<void> {
  await api.patch("/api/usuarios/perfil/password", null, {
    params: { passwordActual, nuevaPassword },
  });
}
