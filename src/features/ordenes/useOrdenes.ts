import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

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
  motivoCancelacion: string | null;
}

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    api
      .get<Orden[]>("/api/ordenes")
      .then((res) => setOrdenes(res.data))
      .catch(() => setError("No se pudieron cargar las órdenes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { ordenes, loading, error, recargar: cargar };
}