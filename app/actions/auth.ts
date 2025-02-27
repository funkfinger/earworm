"use server";

import { cookies } from "next/headers";
import {
  exchangeCodeForToken,
  refreshAccessToken,
  type StoredToken,
} from "../lib/spotify";

const TOKEN_COOKIE_NAME = "spotify_tokens";

export async function handleTokenExchange(code: string): Promise<void> {
  try {
    const tokenResponse = await exchangeCodeForToken(code);

    // Calculate token expiration (subtract 5 minutes for safety margin)
    const expiresAt = Date.now() + (tokenResponse.expires_in - 300) * 1000;

    const tokenData: StoredToken = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt,
    };

    // Store tokens in an HTTP-only cookie
    cookies().set(TOKEN_COOKIE_NAME, JSON.stringify(tokenData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
}

export async function getValidToken(): Promise<string | null> {
  const tokenCookie = cookies().get(TOKEN_COOKIE_NAME);

  if (!tokenCookie?.value) {
    return null;
  }

  try {
    const tokenData: StoredToken = JSON.parse(tokenCookie.value);

    // Check if token needs refresh (expires in less than 5 minutes)
    if (Date.now() >= tokenData.expiresAt) {
      const newTokenResponse = await refreshAccessToken(tokenData.refreshToken);
      const newExpiresAt =
        Date.now() + (newTokenResponse.expires_in - 300) * 1000;

      const newTokenData: StoredToken = {
        accessToken: newTokenResponse.access_token,
        refreshToken: tokenData.refreshToken, // Keep existing refresh token if not provided in response
        expiresAt: newExpiresAt,
      };

      // Update cookie with new token data
      cookies().set(TOKEN_COOKIE_NAME, JSON.stringify(newTokenData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(newExpiresAt),
      });

      return newTokenData.accessToken;
    }

    return tokenData.accessToken;
  } catch (error) {
    console.error("Token validation/refresh error:", error);
    cookies().delete(TOKEN_COOKIE_NAME);
    return null;
  }
}

export async function logout(): Promise<void> {
  cookies().delete(TOKEN_COOKIE_NAME);
}
