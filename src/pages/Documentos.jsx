import { useEffect, useMemo, useState } from "react";
import { countDocumentos, listDocumentosAll, getSignedUrl } from "../services/documentos";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

export default function Documentos() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

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

      const { count: total, error: cErr } = await countDocumentos({ q });
      if (!active) return;
      if (cErr) { setErr(cErr.message); setLoading(false); return; }
      setCount(total);

      const { rows: data, error } = await listDocumentosAll({
        q,
        from: range.from,
        to: range.to
      });

      if (!active) return;
      if (error) setErr(error.message);
      setRows(data);
      setLoading(false);
    })();

    return () => { active = false; };
  }, [q, range.from, range.to]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  async function handleDownload(d) {
    const { url, error } = await getSignedUrl(d.path);
    if (error) return alert(error.message);
    window.open(url, "_blank");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Documentos</h1>

        <button
          onClick={() => navigate("/documentos/nuevo")}
          className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90"
        >
          + Cargar documento
        </button>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
          placeholder="Buscar por título o tipo…"
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
              <th className="px-3 py-2">Expediente</th>
              <th className="px-3 py-2">Título</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Tamaño</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-3 py-4">Cargando…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-4">Sin resultados.</td></tr>
            ) : rows.map(d => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">#{d.expediente_id}</td>
                <td className="px-3 py-2">{d.titulo}</td>
                <td className="px-3 py-2">{d.content_type || "—"}</td>
                <td className="px-3 py-2">{d.size ? `${(Number(d.size)/1024).toFixed(1)} KB` : "—"}</td>
                <td className="px-3 py-2">{new Date(d.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => handleDownload(d)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Descargar
                  </button>
                </td>
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
