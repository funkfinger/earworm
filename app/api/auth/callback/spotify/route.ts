import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  console.log("[Callback] Starting Spotify callback handler...");
  try {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    console.log("[Callback] Received params:", { code: !!code, state });

    const cookieStore = await cookies();
    const storedState = cookieStore.get("spotify_auth_state")?.value;
    console.log("[Callback] Cookie state check:", {
      storedState,
      receivedState: state,
      matches: state === storedState,
    });

    if (!code || !state) {
      console.error("[Callback] Missing required params");
      return NextResponse.redirect(
        new URL("/login?error=missing_params", request.url)
      );
    }

    if (state !== storedState) {
      console.error("[Callback] State mismatch:", { state, storedState });
      return NextResponse.redirect(
        new URL("/login?error=invalid_state", request.url)
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    console.log("[Callback] Credentials check:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
      redirectUri,
    });

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("[Callback] Missing Spotify credentials");
      return NextResponse.redirect(
        new URL("/login?error=server_error", request.url)
      );
    }

    console.log("[Callback] Exchanging code for token...");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      console.error("[Callback] Token exchange failed:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("[Callback] Error response:", errorText);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange", request.url)
      );
    }

    console.log("[Callback] Token exchange successful");
    const data = await response.json();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    console.log("[Callback] Setting cookies...");
    // Set access token with expiry
    cookieStore.set("spotify_access_token", data.access_token, {
      ...cookieOptions,
      maxAge: data.expires_in,
    });

    // Set refresh token with longer expiry
    if (data.refresh_token) {
      cookieStore.set("spotify_refresh_token", data.refresh_token, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    // Clear the state cookie
    cookieStore.set("spotify_auth_state", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    console.log("[Callback] Cookies set successfully");
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("[Callback] Error in Spotify callback:", error);
    if (error instanceof Error) {
      console.error("[Callback] Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.redirect(
      new URL("/login?error=server_error", request.url)
    );
  }
}
