import { cookies } from "next/headers";

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function getSpotifyToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("spotify_access_token")?.value || null;
}

export async function refreshSpotifyToken(
  refresh_token: string
): Promise<SpotifyTokenResponse> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
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
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

export async function generateSpotifyAuthUrl(): Promise<string> {
  console.log("[Auth] Starting generateSpotifyAuthUrl...");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  console.log("[Auth] Environment variables:", {
    hasClientId: !!clientId,
    hasRedirectUri: !!redirectUri,
    redirectUri,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!clientId || !redirectUri) {
    console.error("[Auth] Missing credentials:", {
      hasClientId: !!clientId,
      hasRedirectUri: !!redirectUri,
    });
    throw new Error("Missing Spotify credentials");
  }

  const state = Math.random().toString(36).substring(2, 15);
  const scopes = [
    "user-read-private",
    "user-read-email",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  console.log("[Auth] Generated state:", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    state: state,
  });

  console.log("[Auth] Before setting cookie");
  try {
    const cookieStore = await cookies();
    cookieStore.set("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });
    console.log("[Auth] Cookie set successfully");
  } catch (cookieError) {
    console.error("[Auth] Error setting cookie:", cookieError);
    throw cookieError;
  }

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log("[Auth] Generated auth URL:", authUrl);
  return authUrl;
}
