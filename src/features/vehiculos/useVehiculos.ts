import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

interface Vehiculo {
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  dniCliente: string;
  nombreCliente: string;
  apellidoCliente: string;
  estado: string;
}

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    api
      .get<Vehiculo[]>("/api/vehiculos")
      .then((res) => setVehiculos(res.data))
      .catch(() => setError("No se pudieron cargar los vehículos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { vehiculos, loading, error, recargar: cargar };
}