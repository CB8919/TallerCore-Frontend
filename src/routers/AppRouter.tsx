import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import Clientes from "../features/clientes/Clientes";
import Vehiculos from "../features/vehiculos/Vehiculos";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import MainLayout from "../shared/components/MainLayout";

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

      </Routes>
      
    </BrowserRouter>
  );
}