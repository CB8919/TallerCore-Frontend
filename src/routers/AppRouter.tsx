import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import Clientes from "../features/clientes/Clientes";
import Vehiculos from "../features/vehiculos/Vehiculos";
import Ordenes from "../features/ordenes/Ordenes";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import MainLayout from "../shared/components/MainLayout";
import Historial from "../features/historial/Historial";
import Usuarios from "../features/usuarios/Usuarios";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Clientes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehiculos"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Vehiculos />
              </MainLayout>
            </ProtectedRoute>
          }
        />  
            <Route
  path="/ordenes"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Ordenes />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/historial"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Historial />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/usuarios"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Usuarios />
      </MainLayout>
    </ProtectedRoute>
  }
/>


      </Routes>
      
    </BrowserRouter>
  );
}