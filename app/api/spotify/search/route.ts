import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  console.log("[Spotify Search] Starting search...");
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) {
      console.log("[Spotify Search] No access token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("[Spotify Search] Searching Spotify...");
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("[Spotify Search] Search failed:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("[Spotify Search] Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to search" },
        { status: response.status }
      );
    }

    console.log("[Spotify Search] Search successful");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Spotify Search] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
