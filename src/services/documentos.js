import { supabase } from "../lib/supabase";

export async function countDocumentos({ q }) {
  let base = supabase.from("documentos").select("*", { count: "exact", head: true });
  if (q && q.trim()) {
    base = base.or(`titulo.ilike.%${q}%,content_type.ilike.%${q}%`);
  }
  const { count, error } = await base;
  return { count: count ?? 0, error };
}

export async function listDocumentosAll({ q, from, to }) {
  let query = supabase
    .from("documentos")
    .select("id, expediente_id, titulo, path, content_type, size, subido_por, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q && q.trim()) {
    query = query.or(`titulo.ilike.%${q}%,content_type.ilike.%${q}%`);
  }

  const { data, error } = await query;
  return { rows: data ?? [], error };
}
