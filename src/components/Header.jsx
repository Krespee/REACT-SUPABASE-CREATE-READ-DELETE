import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center gap-6 px-6 py-3 border-b bg-white shadow-sm">
      <nav className="flex gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Dashboard
        </Link>

        <Link to="/expedientes" className="text-gray-700 hover:text-blue-600 font-medium">
          Expedientes
        </Link>

        <Link to="/expedientes/nuevo" className="text-gray-700 hover:text-blue-600 font-medium">
          Nuevo
        </Link>

        {/* ✅ NUEVOS LINKS */}
        <Link to="/audiencias" className="text-gray-700 hover:text-blue-600 font-medium">
          Audiencias
        </Link>

        <Link to="/documentos" className="text-gray-700 hover:text-blue-600 font-medium">
          Documentos
        </Link>
        
      </nav>

      <div className="ml-auto text-gray-600 text-sm">
        {profile?.nombre} ({profile?.rol})
      </div>

      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
      >
        Salir
      </button>
    </header>
  );
}
