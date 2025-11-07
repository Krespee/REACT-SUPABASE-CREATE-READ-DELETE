import { useState } from "react";
import { createAudiencia } from "../services/audiencias";

export default function NuevaAudiencia({ expedienteId, onCreated }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [sala, setSala] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!fecha || !hora) return setErr("Fecha y hora son obligatorias.");
    setLoading(true);

    const fecha_hora = `${fecha}T${hora}:00`; // local
    const { error } = await createAudiencia({
      expediente_id: Number(expedienteId),
      fecha_hora,
      sala,
      estado,
    });

    setLoading(false);
    if (error) return setErr(error.message);
    setFecha(""); setHora(""); setSala(""); setEstado("");
    onCreated?.();
  };

  return (
    <form onSubmit={submit} className="mt-3 border rounded p-3 space-y-2">
      {err && <div className="text-sm text-red-600">{err}</div>}
      <div className="grid md:grid-cols-4 gap-2">
        <input type="date" className="rounded border px-3 py-2" value={fecha} onChange={(e)=>setFecha(e.target.value)} />
        <input type="time" className="rounded border px-3 py-2" value={hora} onChange={(e)=>setHora(e.target.value)} />
        <input placeholder="Sala" className="rounded border px-3 py-2" value={sala} onChange={(e)=>setSala(e.target.value)} />
        <input placeholder="Estado (opcional)" className="rounded border px-3 py-2" value={estado} onChange={(e)=>setEstado(e.target.value)} />
      </div>
      <button disabled={loading} className="rounded bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-60">
        {loading ? "Agendando…" : "Agregar audiencia"}
      </button>
    </form>
  );
}
