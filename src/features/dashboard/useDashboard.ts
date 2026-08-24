import { useEffect, useState } from "react";
import api from "../../services/api";

interface OrdenResumen {
  id: number;
  patenteVehiculo: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anioVehiculo: number;
  nombreCliente: string;
  apellidoCliente: string;
  nombreMecanico: string | null;
  estado: string;
  fechaIngreso: string;
}

export function useDashboard() {
  const [ordenes, setOrdenes] = useState<OrdenResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<OrdenResumen[]>("/api/ordenes")
      .then((res) => setOrdenes(res.data))
      .catch(() => setError("No se pudieron cargar las órdenes"))
      .finally(() => setLoading(false));
  }, []);

  return { ordenes, loading, error };
}