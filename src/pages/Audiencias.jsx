import { useEffect, useMemo, useState } from "react";
import { countAudiencias, listAudienciasAll } from "../services/audiencias";

const PAGE_SIZE = 10;

export default function Audiencias() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const range = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    return { from, to };
  }, [page]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setErr(null);

      const { count: total, error: cErr } = await countAudiencias({ q });
      if (!active) return;
      if (cErr) { setErr(cErr.message); setLoading(false); return; }
      setCount(total);

      const { rows: data, error } = await listAudienciasAll({ q, from: range.from, to: range.to });
      if (!active) return;
      if (error) setErr(error.message);
      setRows(data);
      setLoading(false);
    })();

    return () => { active = false; };
  }, [q, range.from, range.to]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Audiencias</h1>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
          placeholder="Buscar por sala o estado…"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{err}</div>}

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">Expediente</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Sala</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-3 py-4">Cargando…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-4">Sin resultados.</td></tr>
            ) : rows.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2">#{a.expediente_id}</td>
                <td className="px-3 py-2">{new Date(a.fecha_hora).toLocaleString()}</td>
                <td className="px-3 py-2">{a.sala || "—"}</td>
                <td className="px-3 py-2">{a.estado || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">{count} resultado{count === 1 ? "" : "s"} • Página {page} de {totalPages}</div>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</button>
          <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
