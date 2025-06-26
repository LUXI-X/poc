// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import DashboardNavbar from "@/components/dashboard-navbar";
// import Footer from "@/components/footer";
// import { useAuth } from "@/lib/auth-context";
// import { supabase } from "@/lib/supabase";

// export default function ProfilePage() {

//   const { user, signOut } = useAuth();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     phone: "",
//     role: "",
//     type: "",
//   });

//   useEffect(() => {
//     if (user?.user_metadata) {
//       setFormData({
//         name: user.user_metadata.name || "",
//         age: user.user_metadata.age || "",
//         phone: user.user_metadata.phone || "",
//         role: user.user_metadata.role || "",
//         type: user.user_metadata.type || "",
//       });
//     }
//   }, [user]);

//   const handleSignOut = async () => {
//     const { error } = await signOut();
//     if (!error) {
//       router.push("/"); // Redirect to home page after successful sign-out
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       // Update user metadata in Supabase Auth
//       const { error: authError } = await supabase.auth.updateUser({
//         data: formData,
//       });

//       if (authError) throw authError;

//       // Update user profile in profiles table
//       const { error: profileError } = await supabase.from("profiles").upsert({
//         id: user.id,
//         email: user.email,
//         name: formData.name,
//         age: parseInt(formData.age),
//         phone: formData.phone,
//         role: formData.role,
//         type: formData.type,
//         updated_at: new Date().toISOString(),
//       });

//       if (profileError) throw profileError;

//       setMessage("Profile updated successfully!");
//       setIsEditing(false);

//       // Refresh the page to show updated data
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
//     } catch (error) {
//       setMessage("Error updating profile: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
//       <DashboardNavbar />

//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               <div className="w-24 h-24 bg-teal-900 bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
//                 {getInitials(formData.name)}
//               </div>
//               <div className="text-center md:text-left">
//                 <h1 className="text-3xl font-bold mb-2">
//                   {formData.name || "User Profile"}
//                 </h1>
//                 <p className="text-teal-100 mb-1">{user?.email}</p>
//                 <p className="text-teal-200 text-sm">{formData.role}</p>
//               </div>
//             </div>
//           </div>

//           {/* Success/Error Message */}
//           {message && (
//             <div
//               className={`mb-6 p-4 rounded-lg ${
//                 message.includes("Error")
//                   ? "bg-red-50 text-red-700 border border-red-200"
//                   : "bg-green-50 text-green-700 border border-green-200"
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           {/* Profile Information */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-slate-800">
//                 Profile Information
//               </h2>
//               <button
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//               >
//                 {isEditing ? "Cancel" : "Edit Profile"}
//               </button>
//             </div>

//             {isEditing ? (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border  outline-none text-slate-700 font-medium  rounded-lg "
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Age
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.age}
//                     onChange={(e) =>
//                       setFormData({ ...formData, age: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border  outline-none text-slate-700 font-medium  rounded-lg "
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) =>
//                       setFormData({ ...formData, phone: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border  outline-none text-slate-700 font-medium  rounded-lg "
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Role
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.role}
//                     onChange={(e) =>
//                       setFormData({ ...formData, role: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border  outline-none text-slate-700 font-medium  rounded-lg "
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Type
//                   </label>
//                   <select
//                     value={formData.type}
//                     onChange={(e) =>
//                       setFormData({ ...formData, type: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border  outline-none text-slate-700 font-medium  rounded-lg "
//                   >
//                     <option value="">Select Type</option>
//                     <option value="Company">Company</option>
//                     <option value="Employee">Employee</option>
//                     <option value="Project">Project</option>
//                     <option value="Department">Department</option>
//                   </select>
//                 </div>

//                 <div className="md:col-span-2 flex gap-3">
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
//                   >
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Full Name
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {formData.name || "Not provided"}
//                   </p>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Email
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {user?.email}
//                   </p>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Age
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {formData.age || "Not provided"}
//                   </p>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Phone Number
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {formData.phone || "Not provided"}
//                   </p>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Role
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {formData.role || "Not provided"}
//                   </p>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-6">
//                   <h3 className="text-sm font-medium text-slate-600 mb-2">
//                     Type
//                   </h3>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {formData.type || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Account Actions */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-slate-800 mb-6">
//               Account Actions
//             </h2>
//             <div className="space-y-4">
//               <button
//                 onClick={() => router.push("/forgot-password")}
//                 className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//               >
//                 Change Password
//               </button>

//               <button
//                 onClick={handleSignOut}
//                 className="w-full md:w-auto bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors ml-0 md:ml-4"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
// src/app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    role: "",
    type: "",
  });

  // Redirect to login if no user is present
  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = redirectedFrom
        ? `/login?redirectedFrom=${encodeURIComponent(redirectedFrom)}`
        : "/login";
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectedFrom]);

  // Populate form data when user is available
  useEffect(() => {
    if (user?.user_metadata) {
      setFormData({
        name: user.user_metadata.name || "",
        age: user.user_metadata.age || "",
        phone: user.user_metadata.phone || "",
        role: user.user_metadata.role || "",
        type: user.user_metadata.type || "",
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        console.log("Sign-out successful");
        router.push("/"); // Redirect to home page after successful sign-out
      } else {
        setMessage("Error signing out: " + error.message);
      }
    } catch (error) {
      setMessage("Error signing out: " + error.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = async () => {
    setFormLoading(true);
    setMessage("");

    try {
      // Update user metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          phone: formData.phone,
          role: formData.role,
          type: formData.type,
        },
      });

      if (authError) throw authError;

      // Update user profile in profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        phone: formData.phone,
        role: formData.role,
        type: formData.type,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      setMessage("Profile updated successfully!");
      setIsEditing(false);

      // Refresh the session to update user_metadata
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error refreshing session:", sessionError.message);
      } else {
        console.log("Session refreshed:", sessionData.session?.user?.email);
      }
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mb-4"></div>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Return null if no user (redirect handled by useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-teal-900 bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {getInitials(formData.name)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {formData.name || "User Profile"}
                </h1>
                <p className="text-teal-100 mb-1">{user?.email}</p>
                <p className="text-teal-200 text-sm">{formData.role}</p>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Profile Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border outline-none text-slate-700 font-medium rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-3 border outline-none text-slate-700 font-medium rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border outline-none text-slate-700 font-medium rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-3 border outline-none text-slate-700 font-medium rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-3 border outline-none text-slate-700 font-medium rounded-lg"
                  >
                    <option value="">Select Type</option>
                    <option value="Company">Company</option>
                    <option value="Employee">Employee</option>
                    <option value="Project">Project</option>
                    <option value="Department">Department</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={formLoading}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Full Name
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {formData.name || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Email
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Age
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {formData.age || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Phone Number
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {formData.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Role
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {formData.role || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-2">
                    Type
                  </h3>
                  <p className="text-lg font-semibold text-slate-800">
                    {formData.type || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Account Actions
            </h2>
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <button
                onClick={() => router.push("/forgot-password")}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={handleSignOut}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
