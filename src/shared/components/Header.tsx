import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#d1d5db] flex items-center justify-between px-6">

      {/* Título */}
      <h1 className="text-[#111827] font-semibold text-lg">
        TallerCore
      </h1>

      {/* Acciones */}
      <div className="flex items-center gap-4">

        {/* Campana */}
        <button className="relative text-[#6b7280] hover:text-[#111827] transition-colors">
          <Bell size={20} />
        </button>

        {/* Nombre y rol */}
        <div className="text-right">
          <p className="text-[#111827] text-sm font-medium">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-[#6b7280] text-xs capitalize">
            {user?.rol?.toLowerCase()}
          </p>
        </div>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-[#2563EB] flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user ? getInitials(user.nombre, user.apellido) : "?"}
          </span>
        </div>

      </div>
    </header>
  );
}