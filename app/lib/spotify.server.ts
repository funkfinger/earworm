"use server";

import { cookies } from "next/headers";

export async function getSpotifyAccessToken(): Promise<string | undefined> {
  return cookies().get("spotify_access_token")?.value;
}

export async function validateSpotifyAuth() {
  const accessToken = await getSpotifyAccessToken();

  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  return accessToken;
}
