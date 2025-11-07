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

export async function crearDocumento({ expediente_id, file, titulo }) {
  try {
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("documentos")
      .upload(filename, file);

    if (uploadErr) return { error: uploadErr };

    const { data, error } = await supabase
      .from("documentos")
      .insert({
        expediente_id,
        titulo: titulo || null,
        path: filename,            
        content_type: file.type,
        size: file.size,
      });

    return { data, error };
  } catch (err) {
    return { error: err };
  }
}

export async function getSignedUrl(path) {
  const { data, error } = await supabase
    .storage
    .from("documentos")
    .createSignedUrl(path, 60 * 5); // válido 5 minutos

  return { url: data?.signedUrl ?? null, error };
}