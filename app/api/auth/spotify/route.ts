import { NextResponse } from "next/server";

// This is a placeholder for the actual Spotify OAuth implementation
// In a real implementation, you would use the Spotify Web API to generate an authorization URL
export async function GET() {
  try {
    // In a real implementation, you would:
    // 1. Generate a random state string for CSRF protection
    // 2. Store the state in a cookie or session
    // 3. Construct the Spotify authorization URL with proper scopes

    // For now, we'll use placeholder values
    const clientId = process.env.SPOTIFY_CLIENT_ID || "YOUR_SPOTIFY_CLIENT_ID";
    const redirectUri =
      process.env.SPOTIFY_REDIRECT_URI ||
      "http://localhost:3000/api/auth/callback";
    const scopes = [
      "user-read-private",
      "user-read-email",
      "streaming",
      "user-read-playback-state",
      "user-modify-playback-state",
    ].join(" ");

    // Generate a random state string
    const state = Math.random().toString(36).substring(2, 15);

    // Construct the Spotify authorization URL
    const spotifyAuthUrl = new URL("https://accounts.spotify.com/authorize");
    spotifyAuthUrl.searchParams.append("client_id", clientId);
    spotifyAuthUrl.searchParams.append("response_type", "code");
    spotifyAuthUrl.searchParams.append("redirect_uri", redirectUri);
    spotifyAuthUrl.searchParams.append("state", state);
    spotifyAuthUrl.searchParams.append("scope", scopes);

    // Redirect to Spotify authorization page
    return NextResponse.redirect(spotifyAuthUrl.toString());
  } catch (error) {
    console.error("Error initiating Spotify auth:", error);
    return NextResponse.json(
      { error: "Failed to initiate Spotify authentication" },
      { status: 500 }
    );
  }
}
