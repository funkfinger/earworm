import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessTokenCookie = cookieStore.get("spotify_access_token");
    const refreshTokenCookie = cookieStore.get("spotify_refresh_token");

    // If we have an access token, return it
    if (accessTokenCookie?.value) {
      return NextResponse.json({ access_token: accessTokenCookie.value });
    }

    // If we have a refresh token, try to get a new access token
    if (refreshTokenCookie?.value) {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error("Missing Spotify credentials");
        return NextResponse.json({ error: "server_error" }, { status: 500 });
      }

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshTokenCookie.value,
        }),
      });

      if (!response.ok) {
        console.error("Failed to refresh token");
        // Clear the invalid refresh token
        const res = NextResponse.json(
          { error: "token_refresh_failed" },
          { status: 401 }
        );
        res.cookies.delete("spotify_refresh_token");
        return res;
      }

      const data = await response.json();
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      // Create response with new access token
      const res = NextResponse.json({ access_token: data.access_token });

      // Set new access token with expiry
      res.cookies.set("spotify_access_token", data.access_token, {
        ...cookieOptions,
        maxAge: data.expires_in,
      });

      // Set new refresh token if provided
      if (data.refresh_token) {
        res.cookies.set("spotify_refresh_token", data.refresh_token, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }

      return res;
    }

    // No tokens available
    return NextResponse.json({ error: "no_token" }, { status: 401 });
  } catch (error) {
    console.error("Error in token route:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
