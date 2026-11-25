import { useCallback, useEffect, useState } from "react";
import {
  listarUsuarios,
  mensajeError,
  type EstadoUsuario,
  type Usuario,
} from "./usuariosApi";

export function useUsuarios(estado: EstadoUsuario, habilitado = true) {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<{
    estado: EstadoUsuario;
    version: number;
    usuarios: Usuario[];
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!habilitado) return;

    let vigente = true;
    listarUsuarios(estado)
      .then((usuarios) => {
        if (vigente) setResultado({ estado, version, usuarios, error: null });
      })
      .catch((error: unknown) => {
        if (vigente) {
          setResultado({
            estado,
            version,
            usuarios: [],
            error: mensajeError(error, "No se pudieron cargar los usuarios."),
          });
        }
      });

    return () => {
      vigente = false;
    };
  }, [estado, habilitado, version]);

  const recargar = useCallback(() => setVersion((actual) => actual + 1), []);
  const resultadoActual =
    habilitado && resultado?.estado === estado && resultado.version === version;

  return {
    usuarios: resultadoActual ? resultado.usuarios : [],
    loading: habilitado && !resultadoActual,
    error: resultadoActual ? resultado.error : null,
    recargar,
  };
}
