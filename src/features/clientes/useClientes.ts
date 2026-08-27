import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

interface Cliente {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  totalVehiculos: number;
  estado: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    api
      .get<Cliente[]>("/api/clientes")
      .then((res) => setClientes(res.data))
      .catch(() => setError("No se pudieron cargar los clientes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { clientes, loading, error, recargar: cargar };
}