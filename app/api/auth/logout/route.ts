import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  // Clear all Spotify-related cookies by setting them with an expired date
  cookieStore.set("spotify_access_token", "", {
    expires: new Date(0),
    path: "/",
  });
  cookieStore.set("spotify_refresh_token", "", {
    expires: new Date(0),
    path: "/",
  });
  cookieStore.set("spotify_auth_state", "", {
    expires: new Date(0),
    path: "/",
  });

  // Redirect to home page
  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
}
