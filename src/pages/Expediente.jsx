import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Expediente() {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [movs, setMovs] = useState([]);
  const [auds, setAuds] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);

      const [{ data: expData, error: expErr }, { data: mData, error: mErr }, { data: aData, error: aErr }, { data: dData, error: dErr }] =
        await Promise.all([
          supabase.from("expedientes").select("*").eq("id", id).maybeSingle(),
          supabase
            .from("movimientos")
            .select("id, created_at, tipo, descripcion, creado_por")
            .eq("expediente_id", id)
            .order("created_at", { ascending: false }),
          supabase
            .from("audiencias")
            .select("id, fecha_hora, sala, estado, creado_por")
            .eq("expediente_id", id)
            .order("fecha_hora", { ascending: true }),
          supabase
            .from("documentos")
            .select("id, titulo, path, content_type, size, subido_por, created_at")
            .eq("expediente_id", id)
            .order("created_at", { ascending: false }),
        ]);

      if (!active) return;

      if (expErr) { setErr(expErr.message); setLoading(false); return; }
      setExp(expData);
      setMovs(mErr ? [] : mData || []);
      setAuds(aErr ? [] : aData || []);
      setDocs(dErr ? [] : dData || []);
      setLoading(false);
    })();
    return () => { active = false; };
    
  }, [id]);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!exp) return <div className="p-6">No existe el expediente.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {exp.numero} — {exp.caratula}
        </h1>
        <Link to="/expedientes" className="text-sm underline">
          ← Volver
        </Link>
      </div>
      

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium mb-2">Datos</h2>
          <dl className="text-sm space-y-1">
            <div className="flex gap-2">
              <dt className="text-gray-600 w-28">Estado</dt>
              <dd>{exp.estado}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-600 w-28">Actor</dt>
              <dd>{exp.actor || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-600 w-28">Demandado</dt>
              <dd>{exp.demandado || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-600 w-28">Juzgado</dt>
              <dd>#{exp.juzgado_id}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-600 w-28">Creado</dt>
              <dd>{new Date(exp.created_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium mb-2">Documentos</h2>
          {docs.length === 0 ? (
            <div className="text-sm text-gray-600">Sin documentos.</div>
          ) : (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {docs.map((d) => (
                <li key={d.id}>
                  {d.titulo} <span className="text-gray-500">({d.content_type || "archivo"})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium mb-2">Movimientos</h2>
          {movs.length === 0 ? (
            <div className="text-sm text-gray-600">Sin movimientos.</div>
          ) : (
            <ul className="text-sm space-y-2">
              {movs.map((m) => (
                <li key={m.id} className="border rounded p-2">
                  <div className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString()} — {m.tipo || "mov."}
                  </div>
                  <div>{m.descripcion}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium mb-2">Audiencias</h2>
          {auds.length === 0 ? (
            <div className="text-sm text-gray-600">Sin audiencias.</div>
          ) : (
            <ul className="text-sm space-y-2">
              {auds.map((a) => (
                <li key={a.id} className="border rounded p-2">
                  <div className="text-xs text-gray-500">
                    {new Date(a.fecha_hora).toLocaleString()} — {a.sala || "Sala"}
                  </div>
                  <div>Estado: {a.estado || "—"}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
          {(profile?.rol === "juez" || profile?.rol === "admin") && (
  <button
    onClick={async () => {
      if (!confirm("¿Eliminar este expediente?")) return;
      const { error } = await supabase.from("expedientes").delete().eq("id", exp.id);
      if (error) alert(error.message);
      else navigate("/expedientes", { replace: true });
    }}
    className="text-sm mt-2 cursor-pointer text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
  >
    Eliminar expediente
  </button>
)}
      
    </div>
  );
}
