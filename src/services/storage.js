
import { supabase } from "../lib/supabase";

export async function uploadDocumento(file, expedienteId) {
  const filename = `${expedienteId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("documentos")
    .upload(filename, file, { upsert: false });
  if (error) throw error;
  return { path: data.path };
}

export async function getSignedUrl(path, seconds = 60) {
  const { data, error } = await supabase.storage
    .from("documentos")
    .createSignedUrl(path, seconds);
  if (error) throw error;
  return data.signedUrl;
}
