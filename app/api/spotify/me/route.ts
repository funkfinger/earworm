import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  console.log("[Spotify Me] Starting profile fetch...");
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) {
      console.log("[Spotify Me] No access token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("[Spotify Me] Fetching profile with token...");
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("[Spotify Me] Profile fetch failed:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("[Spotify Me] Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: response.status }
      );
    }

    console.log("[Spotify Me] Profile fetch successful");
    const profile = await response.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[Spotify Me] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
