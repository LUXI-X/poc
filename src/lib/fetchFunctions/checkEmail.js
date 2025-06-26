import { supabase } from "../supabase";

export async function checkEmailExists(email) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (error) {
      // If no record is found, Supabase returns a 404-like error (PGRST116)
      if (error.code === "PGRST116") {
        return { exists: false, error: null };
      }
      return { exists: false, error: error.message };
    }

    return { exists: !!data, error: null };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}
