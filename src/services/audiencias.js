import { supabase } from "../lib/supabase";

export async function countAudiencias({ q }) {
  let base = supabase.from("audiencias").select("*", { count: "exact", head: true });
  if (q && q.trim()) {
    base = base.or(`sala.ilike.%${q}%,estado.ilike.%${q}%`);
  }
  const { count, error } = await base;
  return { count: count ?? 0, error };
}

export async function listAudienciasAll({ q, from, to }) {
  let query = supabase
    .from("audiencias")
    .select("id, expediente_id, fecha_hora, sala, estado, creado_por")
    .order("fecha_hora", { ascending: true })
    .range(from, to);

  if (q && q.trim()) {
    query = query.or(`sala.ilike.%${q}%,estado.ilike.%${q}%`);
  }

  const { data, error } = await query;
  return { rows: data ?? [], error };
}
