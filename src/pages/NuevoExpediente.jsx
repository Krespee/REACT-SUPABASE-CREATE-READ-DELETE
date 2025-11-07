import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { createExpediente } from "../services/expedientes";

export default function NuevoExpediente() {
  const [oficinas, setOficinas] = useState([]);
  const [form, setForm] = useState({
    numero: "",
    caratula: "",
    actor: "",
    demandado: "",
    estado: "En trámite",
    juzgado_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("oficinas")
        .select("id, nombre, tipo")
        .eq("tipo", "juzgado");

      if (error) console.warn(error);
      setOficinas(data ?? []);
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.numero.trim() || !form.caratula.trim() || !form.juzgado_id) {
      setErr("Número, carátula y juzgado son obligatorios.");
      return;
    }

    setLoading(true);

    const { data, error } = await createExpediente({
      numero: form.numero.trim(),
      caratula: form.caratula.trim(),
      actor: form.actor.trim(),
      demandado: form.demandado.trim(),
      estado: form.estado,
      juzgado_id: form.juzgado_id,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    navigate(`/expedientes/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Nuevo expediente</h1>

      {err && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Número *</span>
            <input
              name="numero"
              value={form.numero}
              onChange={onChange}
              placeholder="EXP-2025-0005"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Estado</span>
            <input
              name="estado"
              value={form.estado}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Carátula *</span>
          <input
            name="caratula"
            value={form.caratula}
            onChange={onChange}
            placeholder="Pérez c/ Gómez s/ Daños"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            required
          />
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Actor</span>
            <input
              name="actor"
              value={form.actor}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Demandado</span>
            <input
              name="demandado"
              value={form.demandado}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Juzgado *</span>
          <select
            name="juzgado_id"
            value={form.juzgado_id}
            onChange={onChange}
            className="mt-1 w-full rounded-lg border px-3 py-2 bg-white"
            required
          >
            <option value="">Seleccioná un juzgado…</option>
            {oficinas.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre} (#{o.id})
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creando…" : "Crear expediente"}
          </button>
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-lg border px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
