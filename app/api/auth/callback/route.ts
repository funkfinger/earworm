import { NextRequest, NextResponse } from "next/server";

// This is a placeholder for the actual Spotify OAuth callback implementation
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle error from Spotify
    if (error) {
      console.error("Spotify auth error:", error);
      return NextResponse.redirect(
        new URL("/login?error=spotify_auth_error", request.url)
      );
    }

    // Validate the code and state
    if (!code || !state) {
      console.error("Missing code or state");
      return NextResponse.redirect(
        new URL("/login?error=missing_params", request.url)
      );
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri:
            process.env.SPOTIFY_REDIRECT_URI ||
            "http://localhost:3000/api/auth/callback",
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    // Create the response with redirect
    const response = NextResponse.redirect(new URL("/search", request.url));

    // Set cookies in the response
    response.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expires_in,
    });

    response.cookies.set("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_error", request.url)
    );
  }
}
