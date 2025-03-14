import { NextResponse } from "next/server";
import { validateSpotifyAuth } from "@/app/lib/spotify.server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const REPLACEMENT_PLAYLIST_ID = "0E9WYGYWZBqfmp6eJ0Nl1t";

export async function GET() {
  try {
    const accessToken = await validateSpotifyAuth();

    // First, get the playlist tracks
    const response = await fetch(
      `${SPOTIFY_API_URL}/playlists/${REPLACEMENT_PLAYLIST_ID}/tracks?fields=items(track(id,name,artists,album,uri))`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error.message },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No tracks found in playlist" },
        { status: 404 }
      );
    }

    // Select a random track from the playlist
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const randomTrack = data.items[randomIndex].track;

    return NextResponse.json(randomTrack);
  } catch (error) {
    console.error("Error getting replacement track:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
