// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "./supabase";

// const AuthContext = createContext({});

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getInitialSession = async () => {
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.getSession();
//       console.log(
//         "Initial session:",
//         session ? session.user?.email : "No session"
//       );
//       if (error) console.error("Initial session error:", error.message);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     };

//     getInitialSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log("Auth event:", event, "User:", session?.user?.email);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   // Create user profile in profiles table
//   const createUserProfile = async (user) => {
//     try {
//       const userData = user.user_metadata || {};

//       console.log("Creating profile with user data:", {
//         id: user.id,
//         email: user.email,
//         metadata: userData,
//       });

//       const profileData = {
//         id: user.id,
//         email: user.email,
//         name: userData.name || "",
//         age: userData.age ? Number.parseInt(userData.age) : null,
//         phone: userData.phone || "",
//         role: userData.role || "",
//         type: userData.type || "",
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };

//       console.log("Inserting profile data:", profileData);

//       const { data, error } = await supabase
//         .from("profiles")
//         .insert(profileData)
//         .select();

//       if (error) {
//         console.error("Error creating profile:", error);
//         // Try to handle the error gracefully
//         if (error.code === "23505") {
//           console.log("Profile already exists, updating instead...");
//           const { data: updateData, error: updateError } = await supabase
//             .from("profiles")
//             .update({
//               name: profileData.name,
//               age: profileData.age,
//               phone: profileData.phone,
//               role: profileData.role,
//               type: profileData.type,
//               updated_at: profileData.updated_at,
//             })
//             .eq("id", user.id)
//             .select();

//           if (updateError) {
//             console.error("Error updating profile:", updateError);
//           } else {
//             console.log("Profile updated successfully:", updateData);
//           }
//         }
//       } else {
//         console.log("Profile created successfully:", data);
//       }
//     } catch (error) {
//       console.error("Error in createUserProfile:", error);
//     }
//   };

//   // Ensure user profile exists (for existing users)
//   const ensureUserProfile = async (user) => {
//     try {
//       // Check if profile exists
//       const { data: existingProfile, error: fetchError } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();

//       if (fetchError && fetchError.code === "PGRST116") {
//         // Profile doesn't exist, create it
//         console.log("Profile doesn't exist, creating one...");
//         await createUserProfile(user);
//       } else if (fetchError) {
//         console.error("Error checking profile:", fetchError);
//       } else {
//         console.log("Profile already exists:", existingProfile);
//       }
//     } catch (error) {
//       console.error("Error in ensureUserProfile:", error);
//     }
//   };

//   const signUp = async (email, password, userData) => {
//     try {
//       console.log("Signing up user with data:", userData);

//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: userData,
//         },
//       });

//       if (error) {
//         console.error("Signup error:", error);
//       } else {
//         console.log("Signup successful:", data);
//       }

//       return { data, error };
//     } catch (error) {
//       console.error("Error in signUp:", error);
//       return { data: null, error };
//     }
//   };

//   // const signIn = async (email, password) => {
//   //   try {
//   //     console.log("Attempting to sign in user:", email);

//   //     const { data, error } = await supabase.auth.signInWithPassword({
//   //       email,
//   //       password,
//   //     });

//   //     if (error) {
//   //       console.error("Signin error:", error);
//   //     } else {
//   //       console.log("Signin successful:", data);
//   //     }

//   //     return { data, error };
//   //   } catch (error) {
//   //     console.error("Error in signIn:", error);
//   //     return { data: null, error };
//   //   }
//   // };
//   const signIn = async (email, password) => {
//     try {
//       console.log("Attempting to sign in user:", email);
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         console.error("Signin error:", error);
//       } else {
//         console.log("Signin successful:", data);
//         // Ensure session is updated
//         const { data: sessionData, error: sessionError } =
//           await supabase.auth.getSession();
//         if (sessionError) console.error("Session fetch error:", sessionError);
//       }

//       return { data, error };
//     } catch (error) {
//       console.error("Error in signIn:", error);
//       return { data: null, error };
//     }
//   };
//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         console.error("Signout error:", error);
//         return { error };
//       }
//       setUser(null); // Clear the user state immediately
//       return { error: null };
//     } catch (error) {
//       console.error("Error in signOut:", error);
//       return { error };
//     }
//   };

//   const resetPassword = async (email) => {
//     try {
//       const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });
//       return { data, error };
//     } catch (error) {
//       console.error("Error in resetPassword:", error);
//       return { data: null, error };
//     }
//   };

//   const updatePassword = async (newPassword) => {
//     try {
//       const { data, error } = await supabase.auth.updateUser({
//         password: newPassword,
//       });
//       return { data, error };
//     } catch (error) {
//       console.error("Error in updatePassword:", error);
//       return { data: null, error };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//     resetPassword,
//     updatePassword,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
// src/lib/auth-context.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log(
          "Initial session:",
          session ? session.user?.email : "No session"
        );
        if (error) console.error("Initial session error:", error.message);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "User:", session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user) => {
    try {
      const userData = user.user_metadata || {};
      console.log("Creating profile with user data:", {
        id: user.id,
        email: user.email,
        metadata: userData,
      });

      const profileData = {
        id: user.id,
        email: user.email,
        name: userData.name || "",
        age: userData.age ? Number.parseInt(userData.age) : null,
        phone: userData.phone || "",
        role: userData.role || "",
        type: userData.type || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select();

      if (error) {
        console.error("Error creating profile:", error);
        if (error.code === "23505") {
          console.log("Profile already exists, updating instead...");
          const { data: updateData, error: updateError } = await supabase
            .from("profiles")
            .update({
              name: profileData.name,
              age: profileData.age,
              phone: profileData.phone,
              role: profileData.role,
              type: profileData.type,
              updated_at: profileData.updated_at,
            })
            .eq("id", user.id)
            .select();
          if (updateError) {
            console.error("Error updating profile:", updateError);
          } else {
            console.log("Profile updated successfully:", updateData);
          }
        }
      } else {
        console.log("Profile created successfully:", data);
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);
    }
  };

  const ensureUserProfile = async (user) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code === "PGRST116") {
        console.log("Profile doesn't exist, creating one...");
        await createUserProfile(user);
      } else if (fetchError) {
        console.error("Error checking profile:", fetchError);
      } else {
        console.log("Profile already exists:", existingProfile);
      }
    } catch (error) {
      console.error("Error in ensureUserProfile:", error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      console.log("Signing up user with data:", userData);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Signup error:", error);
      } else {
        console.log("Signup successful:", data);
        if (data.user) {
          await ensureUserProfile(data.user);
          setUser(data.user);
        }
      }
      return { data, error };
    } catch (error) {
      console.error("Error in signUp:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log("Attempting to sign in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error);
      } else {
        console.log("Signin successful:", data);
        if (data.user) {
          setUser(data.user);
          await ensureUserProfile(data.user);
          // Ensure session is refreshed
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();
          if (sessionError) console.error("Session fetch error:", sessionError);
          else
            console.log(
              "Session after signIn:",
              sessionData.session?.user?.email
            );
        }
      }
      return { data, error };
    } catch (error) {
      console.error("Error in signIn:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Signout error:", error);
        return { error };
      }
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error("Error in signOut:", error);
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (error) {
      console.error("Error in updatePassword:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
