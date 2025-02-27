import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Delete the Spotify token cookies by setting maxAge to 0
    const cookieStore = await cookies();
    cookieStore.set("spotify_token", "", { maxAge: 0 });
    cookieStore.set("spotify_refresh_token", "", { maxAge: 0 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
