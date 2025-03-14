import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check for Spotify access token
    const accessToken = request.cookies.get("spotify_access_token");

    if (!accessToken?.value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { trackId, trackName, artistName, albumArt } = body;

    if (!trackId || !trackName || !artistName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Store the earworm in a cookie for now
    // TODO: Replace with database storage
    const response = NextResponse.json({ success: true });

    response.cookies.set(
      "current_earworm",
      JSON.stringify({
        trackId,
        trackName,
        artistName,
        albumArt,
        timestamp: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to save earworm:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
