import { useState } from "react";
import { uploadDocumento, listDocumentos, getSignedUrl } from "../services/documentos";

export default function UploaderDocumento({ expedienteId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!file) return setErr("Seleccioná un archivo.");
    setLoading(true);

    const { error } = await uploadDocumento({
      expediente_id: Number(expedienteId),
      file,
      titulo,
    });

    setLoading(false);
    if (error) return setErr(error.message);
    setFile(null); setTitulo("");
    onUploaded?.();
  };

  return (
    <form onSubmit={submit} className="mt-3 border rounded p-3 space-y-2">
      {err && <div className="text-sm text-red-600">{err}</div>}
      <div className="grid md:grid-cols-3 gap-2">
        <input
          className="rounded border px-3 py-2"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e)=>setTitulo(e.target.value)}
        />
        <input
          type="file"
          className="rounded border px-3 py-2"
          onChange={(e)=>setFile(e.target.files?.[0] ?? null)}
        />
        <button
          disabled={loading}
          className="rounded bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Subiendo…" : "Subir documento"}
        </button>
      </div>
    </form>
  );
}
