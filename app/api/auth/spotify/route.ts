import { NextResponse } from "next/server";
import { generateSpotifyAuthUrl } from "@/app/lib/auth";

// This is a placeholder for the actual Spotify OAuth implementation
// In a real implementation, you would use the Spotify Web API to generate an authorization URL
export async function GET() {
  console.log("[Spotify Route] Starting...");
  try {
    console.log("[Spotify Route] Before generating auth URL");
    let authUrl;
    try {
      authUrl = await generateSpotifyAuthUrl();
      console.log("[Spotify Route] Auth URL generated successfully:", authUrl);
    } catch (genError) {
      console.error("[Spotify Route] Error generating auth URL:", genError);
      throw genError;
    }

    console.log("[Spotify Route] Before creating URL object");
    let spotifyAuthUrl;
    try {
      spotifyAuthUrl = new URL(authUrl);
      console.log(
        "[Spotify Route] URL object created successfully:",
        spotifyAuthUrl.toString()
      );
    } catch (urlError) {
      console.error("[Spotify Route] Error creating URL object:", urlError);
      throw urlError;
    }

    console.log("[Spotify Route] Before redirect");
    const response = NextResponse.redirect(spotifyAuthUrl);
    console.log("[Spotify Route] Response created successfully");
    return response;
  } catch (error) {
    console.error("[Spotify Route] Top-level error caught:", {
      error,
      type: typeof error,
      isError: error instanceof Error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/login?error=auth_error", baseUrl));
  }
}
