import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { countExpedientes, listExpedientes } from "../services/expedientes";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const PAGE_SIZE = 10;

export default function Expedientes() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const canDelete = profile?.rol === "juez" || profile?.rol === "admin";

  const range = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    return { from, to };
  }, [page]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);

      // 1) contar
      const { count: totalCount, error: countErr } = await countExpedientes(q);
      if (!active) return;
      if (countErr) {
        setErr(countErr.message);
        setLoading(false);
        return;
      }
      setCount(totalCount);

      // 2) listar paginado
      const { rows: data, error } = await listExpedientes({
        q,
        from: range.from,
        to: range.to,
      });
      if (!active) return;

      if (error) setErr(error.message);
      setRows(data);
      setLoading(false);
    })();

    return () => { active = false; };
  }, [q, page, range.from, range.to]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Expedientes</h1>
        <button
          onClick={() => navigate("/expedientes/nuevo")}
          className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90"
        >
          + Nuevo expediente
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Buscar por número o carátula…"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {err && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
          {err}
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Carátula</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Juzgado</th>
              <th className="px-3 py-2">Creado</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-4" colSpan={6}>Cargando…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4" colSpan={6}>Sin resultados.</td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{e.numero}</td>
                  <td className="px-3 py-2">{e.caratula}</td>
                  <td className="px-3 py-2">{e.estado}</td>
                  <td className="px-3 py-2">#{e.juzgado_id}</td>
                  <td className="px-3 py-2">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/expedientes/${e.id}`} className="text-black underline">
                      Ver
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right">

                    {canDelete && (
                      <button
                        onClick={async () => {
                          if (!confirm("¿Eliminar expediente y sus datos asociados?")) return;
                          const { error } = await supabase.from("expedientes").delete().eq("id", e.id);
                          if (error) alert(error.message);
                          else setRows(prev => prev.filter(r => r.id !== e.id));
                        }}
                        className="text-red-600 underline cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
      </div>

      {/* Paginado */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {count} resultado{count === 1 ? "" : "s"} • Página {page} de {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
