import { NextResponse } from "next/server";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");

export async function GET() {
  try {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
      response_type: "code",
      redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "",
      scope: SPOTIFY_SCOPES,
      show_dialog: "true",
    });

    if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
      throw new Error("Missing Spotify client ID");
    }

    if (!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) {
      throw new Error("Missing Spotify redirect URI");
    }

    return NextResponse.json({
      success: true,
      url: `${SPOTIFY_AUTH_URL}?${params.toString()}`,
    });
  } catch (error) {
    console.error("Failed to generate Spotify auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect to Spotify",
      },
      { status: 500 }
    );
  }
}
