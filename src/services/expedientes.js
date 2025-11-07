// src/services/expedientes.js
import { supabase } from "../lib/supabase";

export async function createExpediente(input) {
  return supabase
    .from("expedientes")
    .insert({
      numero: input.numero.trim(),
      caratula: input.caratula.trim(),
      actor: input.actor?.trim() || null,
      demandado: input.demandado?.trim() || null,
      estado: input.estado || "En trámite",
      juzgado_id: Number(input.juzgado_id),
    })
    .select("id")
    .single();
}

/** ✅ Cuenta expedientes (para paginado) */
export async function countExpedientes(q) {
  let base = supabase
    .from("expedientes")
    .select("*", { count: "exact", head: true });

  if (q && q.trim()) {
    base = base.or(`numero.ilike.%${q}%,caratula.ilike.%${q}%`);
  }

  const { count, error } = await base;
  return { count: count ?? 0, error };
}

/** ✅ Lista expedientes paginados */
export async function listExpedientes({ q, from, to }) {
  let query = supabase
    .from("expedientes")
    .select("id, numero, caratula, estado, juzgado_id, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q && q.trim()) {
    query = query.or(`numero.ilike.%${q}%,caratula.ilike.%${q}%`);
  }

  const { data, error } = await query;

  return {
    rows: data ?? [],
    error,
  };
}

/** ✅ Obtener expediente por ID */
export async function getExpediente(id) {
  return supabase
    .from("expedientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
}

/** ✅ Crear movimiento */
export async function addMovimiento({ expediente_id, tipo, descripcion }) {
  return supabase
    .from("movimientos")
    .insert({
      expediente_id,
      tipo: tipo || null,
      descripcion,
      // creado_por se llena solo si default = auth.uid()
    })
    .select("id")
    .single();
}
