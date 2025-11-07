import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expedientes from "./pages/Expedientes";
import NuevoExpediente from "./pages/NuevoExpediente";
import Expediente from "./pages/Expediente";
import Audiencias from "./pages/Audiencias";
import Documentos from "./pages/Documentos";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">


      <AuthHeader />

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audiencias"
            element={
              <ProtectedRoute>
                <Audiencias />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documentos"
            element={
              <ProtectedRoute>
                <Documentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedientes"
            element={
              <ProtectedRoute>
                <Expedientes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedientes/:id"
            element={
              <ProtectedRoute>
                <Expediente />
              </ProtectedRoute>
            }
          />          

          <Route
            path="/expedientes/nuevo"
            element={
              <ProtectedRoute>
                <NuevoExpediente />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>

      </main>

    </div>
  );
}

function AuthHeader() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return null;

  return <Header />;
}
