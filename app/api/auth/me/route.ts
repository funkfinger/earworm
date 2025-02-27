import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

async function fetchSpotifyProfile(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("spotify_token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const profile = await fetchSpotifyProfile(token.value);

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        display_name: profile.display_name,
        images: profile.images || [],
      },
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile",
      },
      { status: 500 }
    );
  }
}
