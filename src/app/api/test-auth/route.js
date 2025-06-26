import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return NextResponse.json({
    session: session
      ? {
          accessToken: session.access_token,
          user: session.user?.email, // ✅ fixed this line
        }
      : null,
    error: error?.message,
  });
}
