import { useAuth } from "../context/AuthContext";

export default function Dashboard(){
  const { profile } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Bienvenido, {profile?.nombre}
      </h2>

      <div className="bg-white shadow rounded p-4 text-gray-700">
        <p><b>Oficina:</b> {profile?.oficina_id ?? "—"}</p>
      </div>
    </div>
  );
}
