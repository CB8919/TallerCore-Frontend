import { useMemo, useState } from "react";
import { KeyRound, Mail, Power, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ModalNuevoUsuario from "./ModalNuevoUsuario";
import ModalResetPassword from "./ModalResetPassword";
import ModalEstadoUsuario from "./ModalEstadoUsuario";
import ModalCambiarEmail from "./ModalCambiarEmail";
import ModalCambiarPassword from "./ModalCambiarPassword";
import { useUsuarios } from "./useUsuarios";
import {
  cambiarRolUsuario,
  mensajeError,
  type EstadoUsuario,
  type RolUsuario,
  type Usuario,
} from "./usuariosApi";

const roles: RolUsuario[] = ["ADMIN", "ADMIN_MECANICO", "MECANICO"];

const estadoBadge: Record<EstadoUsuario, string> = {
  ACTIVO: "bg-[#DCFCE7] text-[#166534]",
  INACTIVO: "bg-[#FEE2E2] text-[#991B1B]",
};

function coincideUsuario(usuario: Usuario, query: string): boolean {
  return `${usuario.dni} ${usuario.nombre} ${usuario.apellido} ${usuario.email}`
    .toLowerCase()
    .includes(query);
}

export default function Usuarios() {
  const { user } = useAuth();
  const esAdmin = user?.rol === "ADMIN";
  const nombreUsuario = [user?.nombre, user?.apellido].filter(Boolean).join(" ");
  const inicialesUsuario = [user?.nombre, user?.apellido]
    .map((nombre) => nombre?.trim().charAt(0) ?? "")
    .join("")
    .toUpperCase();
  const etiquetaRol = user?.rol === "ADMIN"
    ? "Administrador"
    : user?.rol === "ADMIN_MECANICO"
      ? "Admin mecánico"
      : "Mecánico";
  const [estado, setEstado] = useState<EstadoUsuario>("ACTIVO");
  const { usuarios, loading, error, recargar } = useUsuarios(esAdmin ? estado : "ACTIVO", esAdmin);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [rolesPendientes, setRolesPendientes] = useState<Record<string, RolUsuario>>({});
  const [usuarioParaPassword, setUsuarioParaPassword] = useState<Usuario | null>(null);
  const [usuarioParaEstado, setUsuarioParaEstado] = useState<Usuario | null>(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarCambiarEmail, setMostrarCambiarEmail] = useState(false);
  const [mostrarCambiarPassword, setMostrarCambiarPassword] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const usuariosFiltrados = useMemo(() => {
    const query = busquedaAplicada.trim().toLowerCase();
    if (!query) return usuarios;
    return usuarios.filter((usuario) => coincideUsuario(usuario, query));
  }, [busquedaAplicada, usuarios]);

  const sugerencias = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    if (!mostrarSugerencias || !query) return [];
    return usuarios.filter((usuario) => coincideUsuario(usuario, query)).slice(0, 8);
  }, [busqueda, mostrarSugerencias, usuarios]);

  function buscarUsuarios(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusquedaAplicada(busqueda.trim());
    setMostrarSugerencias(false);
    recargar();
  }

  function seleccionarUsuario(usuario: Usuario) {
    setBusqueda(usuario.dni);
    setBusquedaAplicada(usuario.dni);
    setMostrarSugerencias(false);
  }

  async function guardarRol(usuario: Usuario) {
    const nuevoRol = rolesPendientes[usuario.dni] ?? usuario.rol;
    if (nuevoRol === usuario.rol) return;

    setMensaje(null);
    setErrorAccion(null);
    try {
      await cambiarRolUsuario(usuario.dni, nuevoRol);
      setRolesPendientes((actuales) => {
        const siguientes = { ...actuales };
        delete siguientes[usuario.dni];
        return siguientes;
      });
      setMensaje(`Se actualizó el rol de ${usuario.nombre} ${usuario.apellido}.`);
      await recargar();
    } catch (error: unknown) {
      setErrorAccion(mensajeError(error, "No se pudo cambiar el rol."));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Usuarios</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          {esAdmin
            ? "Administrá las cuentas y permisos del personal."
            : "Gestioná tu email y contraseña desde Mi perfil."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-sm font-semibold text-white">
              {inicialesUsuario}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">{nombreUsuario}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {etiquetaRol}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                Actualizá tu email o contraseña.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMostrarCambiarEmail(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Mail size={16} />
              Cambiar email
            </button>
            <button
              type="button"
              onClick={() => setMostrarCambiarPassword(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
            >
              <KeyRound size={16} />
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>

      {esAdmin && (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={buscarUsuarios} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar por DNI, nombre o email..."
              aria-label="Buscar usuarios"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setBusquedaAplicada("");
                setMostrarSugerencias(true);
              }}
              autoComplete="off"
              className="w-72 rounded-lg border border-[#d1d5db] px-4 py-2 text-sm text-[#111827] placeholder-[#6b7280] focus:border-[#2563EB] focus:outline-none"
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 mt-1 w-96 overflow-hidden rounded-lg border border-[#d1d5db] bg-white shadow-sm">
                {sugerencias.map((usuario) => (
                  <li key={usuario.dni}>
                    <button
                      type="button"
                      onClick={() => seleccionarUsuario(usuario)}
                      className="cursor-pointer flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[#f4f5f7]"
                    >
                      <span className="font-medium text-[#111827]">
                        {usuario.nombre} {usuario.apellido} · {usuario.dni}
                      </span>
                      <span className="text-[#6b7280]">{usuario.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {busquedaAplicada && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setBusquedaAplicada("");
                setMostrarSugerencias(false);
              }}
              className="cursor-pointer inline-flex h-10 w-28 items-center justify-center whitespace-nowrap rounded-lg border border-[#2563EB] text-sm font-medium text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
            >
              Limpiar
            </button>
          )}
        </form>
        <div className="flex items-center gap-3">
          {esAdmin && (
            <>
              <select
                aria-label="Filtrar usuarios por estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoUsuario)}
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#111827] focus:border-[#2563EB] focus:outline-none"
              >
                <option value="ACTIVO">Activos</option>
                <option value="INACTIVO">Inactivos</option>
              </select>
              <button
                type="button"
                onClick={() => setMostrarCrear(true)}
                className="cursor-pointer flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <UserPlus size={16} />
                Nuevo usuario
              </button>
            </>
          )}
        </div>
      </div>
      )}

      {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}
      {errorAccion && <p className="text-sm text-[#EF4444]">{errorAccion}</p>}

      {esAdmin && (
      <div className="overflow-hidden rounded-lg border border-[#d1d5db] bg-white shadow-sm">
        {loading && <p className="px-6 py-8 text-sm text-[#6b7280]">Cargando usuarios...</p>}
        {error && <p className="px-6 py-8 text-sm text-[#EF4444]">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d1d5db] text-left text-xs uppercase tracking-wider text-[#6b7280]">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">DNI</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Estado</th>
                  {esAdmin && <th className="px-6 py-3 text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={esAdmin ? 6 : 5} className="px-6 py-8 text-center text-[#6b7280]">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => {
                    const rolPendiente = rolesPendientes[usuario.dni] ?? usuario.rol;
                    return (
                      <tr key={usuario.dni} className="border-b border-[#d1d5db] last:border-0 hover:bg-[#f4f5f7]">
                        <td className="px-6 py-4 text-[#111827]">{usuario.nombre} {usuario.apellido}</td>
                        <td className="px-6 py-4 text-[#111827]">{usuario.dni}</td>
                        <td className="px-6 py-4 text-[#111827]">{usuario.email}</td>
                        <td className="px-6 py-4 text-[#111827]">
                          {esAdmin ? (
                            <div className="flex items-center gap-2">
                              <select
                                aria-label={`Rol de ${usuario.nombre} ${usuario.apellido}`}
                                value={rolPendiente}
                                onChange={(e) =>
                                  setRolesPendientes((actuales) => ({
                                    ...actuales,
                                    [usuario.dni]: e.target.value as RolUsuario,
                                  }))
                                }
                                className="rounded-lg border border-[#d1d5db] px-2 py-1 text-sm focus:border-[#2563EB] focus:outline-none"
                              >
                                {roles.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                              </select>
                              {rolPendiente !== usuario.rol && (
                                <button
                                  type="button"
                                  onClick={() => void guardarRol(usuario)}
                                  className="text-xs font-medium text-[#2563EB] hover:text-blue-700"
                                >
                                  Guardar
                                </button>
                              )}
                            </div>
                          ) : usuario.rol}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-md px-3 py-1 text-xs font-medium ${estadoBadge[usuario.estado]}`}>
                            {usuario.estado}
                          </span>
                        </td>
                        {esAdmin && (
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setUsuarioParaPassword(usuario)}
                                aria-label={`Restablecer contraseña de ${usuario.nombre} ${usuario.apellido}`}
                                title="Restablecer contraseña"
                                className="text-[#2563EB] transition-colors hover:text-blue-700"
                              >
                                <KeyRound size={17} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMensaje(null);
                                  setErrorAccion(null);
                                  setUsuarioParaEstado(usuario);
                                }}
                                aria-label={`${usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"} a ${usuario.nombre} ${usuario.apellido}`}
                                title={usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                                className={usuario.estado === "ACTIVO"
                                  ? "text-[#EF4444] transition-colors hover:text-red-700"
                                  : "text-green-700 transition-colors hover:text-green-900"}
                              >
                                <Power size={17} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {esAdmin && mostrarCrear && (
        <ModalNuevoUsuario
          onClose={() => setMostrarCrear(false)}
          onSuccess={() => {
            setMensaje("Usuario creado correctamente.");
            if (estado === "ACTIVO") void recargar();
            else setEstado("ACTIVO");
          }}
        />
      )}
      {mostrarCambiarEmail && (
        <ModalCambiarEmail
          onClose={() => setMostrarCambiarEmail(false)}
          onSuccess={() => {
            setMensaje("Tu email se actualizó correctamente.");
            setErrorAccion(null);
            if (esAdmin) void recargar();
          }}
        />
      )}
      {mostrarCambiarPassword && (
        <ModalCambiarPassword
          onClose={() => setMostrarCambiarPassword(false)}
          onSuccess={() => {
            setMensaje("Tu contraseña se actualizó correctamente.");
            setErrorAccion(null);
          }}
        />
      )}
      {esAdmin && usuarioParaPassword && (
        <ModalResetPassword
          dni={usuarioParaPassword.dni}
          nombre={`${usuarioParaPassword.nombre} ${usuarioParaPassword.apellido}`}
          onClose={() => setUsuarioParaPassword(null)}
          onSuccess={() => setMensaje("Contraseña restablecida correctamente.")}
        />
      )}
      {esAdmin && usuarioParaEstado && (
        <ModalEstadoUsuario
          usuario={usuarioParaEstado}
          onClose={() => setUsuarioParaEstado(null)}
          onSuccess={() => {
            setMensaje(
              usuarioParaEstado.estado === "ACTIVO"
                ? `Se desactivó la cuenta de ${usuarioParaEstado.nombre} ${usuarioParaEstado.apellido}.`
                : `Se activó la cuenta de ${usuarioParaEstado.nombre} ${usuarioParaEstado.apellido}.`,
            );
            void recargar();
          }}
        />
      )}
    </div>
  );
}
