import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "",
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      throw new Error("No authorization code received");
    }

    const tokenData = await exchangeCodeForToken(code);

    // Store the access token in a cookie
    const cookieStore = cookies();
    cookieStore.set("spotify_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Set expiry based on Spotify's expiry time
      maxAge: tokenData.expires_in,
    });

    // Also store refresh token if provided
    if (tokenData.refresh_token) {
      cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 401 }
    );
  }
}
