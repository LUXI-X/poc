import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Define protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/details"];

export async function middleware(request) {
  try {
    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            // Set cookies in the response
            return NextResponse.next().cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            // Delete cookies in the response
            return NextResponse.next().cookies.delete({
              name,
              ...options,
            });
          },
        },
      }
    );

    // Get the session from Supabase
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const pathname = request.nextUrl.pathname;

    // Log session details for debugging
    console.log("Middleware - Path:", pathname);
    console.log(
      "Middleware - Access Token:",
      session?.access_token || "No token"
    );
    console.log(
      "Middleware - User:",
      session?.user ? session.user.email : "No user"
    );
    if (error) console.error("Middleware - Session Error:", error.message);

    // Check if the route is public
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route)
    );

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route)
    );

    // Redirect to login if session is missing for protected routes
    if (isProtectedRoute && (!session?.access_token || !session?.user)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
