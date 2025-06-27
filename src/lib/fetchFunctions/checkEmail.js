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

// Fetch all contact submissions
export async function fetchContactSubmissions() {
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// Delete a contact submission by ID
export async function deleteContactSubmission(id) {
  try {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function fetchAllProfiles() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function updateProfile(id, updates) {
  try {
    // Ensure email and password are not included in updates
    const { email, password, ...allowedUpdates } = updates;
    const { error } = await supabase
      .from("profiles")
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteProfile(id) {
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
