import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing environment variables for Spotify authentication");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

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
      console.error("Token refresh error:", errorData);
      throw new Error(`Failed to refresh token: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("spotify_token");
    const refreshToken = cookieStore.get("spotify_refresh_token");

    // If no token exists but we have a refresh token, try to refresh
    if ((!token || token.value === "") && refreshToken && refreshToken.value) {
      try {
        console.log("Refreshing expired token...");
        const tokenData = await refreshAccessToken(refreshToken.value);

        // Store the new access token
        cookieStore.set("spotify_token", tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: tokenData.expires_in,
          path: "/",
        });

        // Update refresh token if a new one was provided
        if (tokenData.refresh_token) {
          cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
          });
        }

        return NextResponse.json({
          success: true,
          token: tokenData.access_token,
        });
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return NextResponse.json(
          { success: false, error: "Failed to refresh token" },
          { status: 401 }
        );
      }
    }

    if (!token || token.value === "") {
      return NextResponse.json(
        { success: false, error: "No token found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, token: token.value });
  } catch (error) {
    console.error("Token retrieval error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve token" },
      { status: 500 }
    );
  }
}
