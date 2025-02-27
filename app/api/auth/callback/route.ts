import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function exchangeCodeForToken(code: string) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing environment variables for Spotify authentication");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: params,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token exchange error:", errorData);
      throw new Error(`Failed to exchange code: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, error: "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const cookieStore = await cookies();

    // Store the access token in a cookie
    cookieStore.set("spotify_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    });

    // Store the refresh token in a cookie if available
    if (tokenData.refresh_token) {
      cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // Refresh tokens don't expire, but we'll set a long expiry
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to exchange code for token" },
      { status: 500 }
    );
  }
}
