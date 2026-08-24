import logo from "../../assets/logo_sidebar.png";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  ClipboardList,
  UserCog,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Vehículos", icon: Car, path: "/vehiculos" },
  { label: "Órdenes", icon: Wrench, path: "/ordenes" },
  { label: "Historial", icon: ClipboardList, path: "/historial" },
  { label: "Usuarios", icon: UserCog, path: "/usuarios" },
];

export default function Sidebar() {

  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-[#1a2035] flex flex-col">

      {/* Logo */}
      <div className="flex flex-col items-center py-8 border-b border-white/10">
        <img src={logo} alt="Logo" className="h-16 w-auto mb-3" />
        <p className="text-white font-bold text-sm tracking-widest uppercase">
          CB Forge Labs
        </p>
        <p className="text-[#2563EB] text-xs tracking-wide mt-1">
          TallerCore
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 px-3 py-6 flex-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2563EB] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}