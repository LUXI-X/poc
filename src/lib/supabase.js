// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl =
//   process.env.NEXT_PUBLIC_SUPABASE_URL ||
//   "https://tvsdldcoqpezfhrvudfs.supabase.co";
// const supabaseAnonKey =
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2RsZGNvcXBlemZocnZ1ZGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDczNzUsImV4cCI6MjA2NjQyMzM3NX0.MZOdqzfFHDX2LCA5nMQlqPxX0tQ64qNKwP6OBVBusO0";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl =
//   process.env.NEXT_PUBLIC_SUPABASE_URL ||
//   "https://tvsdldcoqpezfhrvudfs.supabase.co";
// const supabaseAnonKey =
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2RsZGNvcXBlemZocnZ1ZGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDczNzUsImV4cCI6MjA2NjQyMzM3NX0.MZOdqzfFHDX2LCA5nMQlqPxX0tQ64qNKwP6OBVBusO0";

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// // Auth helper functions
// export const signUp = async (email, password, userData) => {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: userData,
//     },
//   });
//   return { data, error };
// };

// export const signIn = async (email, password) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   return { data, error };
// };

// export const signOut = async () => {
//   const { error } = await supabase.auth.signOut();
//   return { error };
// };

// export const resetPassword = async (email) => {
//   const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${window.location.origin}/reset-password`,
//   });
//   return { data, error };
// };

// export const updatePassword = async (newPassword) => {
//   const { data, error } = await supabase.auth.updateUser({
//     password: newPassword,
//   });
//   return { data, error };
// };

// export const getCurrentUser = async () => {
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();
//   return { user, error };
// };
