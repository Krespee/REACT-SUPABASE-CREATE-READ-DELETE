import { useRef, useState } from "react";
import { crearDocumento } from "../services/documentos"; // 👈 sólo lo que usamos

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

export default function UploaderDocumento({ expedienteId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    setOk(false);
    setErr(null);
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !titulo.trim()) {
      const base = f.name.replace(/\.[^.]+$/, "");
      setTitulo(base);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setOk(false);

    if (!expedienteId) return setErr("Falta el ID de expediente.");
    if (!file) return setErr("Seleccioná un archivo.");
    if (file.size > MAX_SIZE_BYTES) {
      return setErr(`El archivo supera el límite de ${(MAX_SIZE_BYTES / (1024 * 1024)).toFixed(0)} MB.`);
    }

    setLoading(true);
    try {
      const { error } = await crearDocumento({
        expediente_id: Number(expedienteId),
        file,
        titulo: titulo?.trim() || file.name,
      });

      if (error) throw error;

      setFile(null);
      setTitulo("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setOk(true);


      onUploaded?.();
    } catch (e) {
      setErr(e?.message || "No se pudo subir el documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 border rounded-lg p-3 space-y-3 bg-white">
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>}
      {ok && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">Documento subido correctamente.</div>}

      <div className="grid md:grid-cols-3 gap-2">
        <input
          className="rounded border px-3 py-2"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e) => { setOk(false); setTitulo(e.target.value); }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_TYPES}
          className="rounded border px-3 py-2"
          onChange={onFileChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-60 cursor-pointer"
          title="Subir documento"
        >
          {loading ? "Subiendo…" : "Subir documento"}
        </button>
      </div>

      {file && (
        <div className="text-xs text-gray-600">
          Seleccionado: <span className="font-medium">{file.name}</span> — {(file.size / (1024 * 1024)).toFixed(2)} MB
        </div>
      )}

      <div className="text-[11px] text-gray-500">
        Tipos aceptados: PDF, PNG, JPG, WEBP, TXT, DOC/DOCX. Límite {MAX_SIZE_BYTES / (1024 * 1024)}MB.
      </div>
    </form>
  );
}
