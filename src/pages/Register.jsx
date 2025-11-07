// src/pages/Register.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { session, loading } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const { error } = await signUp({
      email,
      password,
      nombre,
    });
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Usuario creado. Si se requiere, verificá tu email. Redirigiendo a login...");
      setTimeout(() => nav("/login"), 1200);
    }
  };

  useEffect(() => {
    if (!loading && session) {
      navigate("/dashboard");
    }
  }, [loading, session]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Crear cuenta</h2>

        <input
          className="w-full p-2 border rounded focus:outline-blue-500"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded focus:outline-blue-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded focus:outline-blue-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />


        <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Registrarme
        </button>

        {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}

        <p className="text-center text-sm text-gray-600">
          ¿Ya tenés cuenta?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">Ingresar</Link>
        </p>
      </form>
    </div>
  );
}
