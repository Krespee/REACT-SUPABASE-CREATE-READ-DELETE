import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");
  const { signIn } = useAuth();
  const { session, loading } = useAuth();

  const navigate = useNavigate();
  
  useEffect(() => {
      if (!loading && session) {
        navigate("/dashboard");
        console.log(loading)
      }
    }, [loading, session]);

  const onSubmit = async(e)=>{
    e.preventDefault();
  const { error } = await signIn({ email, password });

  if (error) {
    alert("Credenciales inválidas");
    return;
  }

  navigate("/dashboard");
  };
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="mb-4 p-3 bg-blue-50 text-sm text-blue-700 rounded">
          <p>Accesos de prueba:</p>
          <ul className="list-disc ml-4">
            <li><b>Juez:</b> juez1@gmail.com — <b>123456</b></li>
            <li><b>Empleado:</b> empleado1@gmail.com — <b>123456</b></li>
          </ul>
        </div>

      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Ingresar</h2>

        <input className="w-full p-2 border rounded focus:outline-blue-500" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />

        <input className="w-full p-2 border rounded focus:outline-blue-500" type="password"
               placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

        <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Entrar
        </button>

        {msg && <p className="text-sm text-red-600 text-center">{msg}</p>}

        <p className="text-center text-sm text-gray-600">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
