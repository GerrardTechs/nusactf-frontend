import { supabase } from "./supabase";

export async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error("Sesi tidak ditemukan. Silakan login ulang.");
  }

  return data.session.access_token;
}