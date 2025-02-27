import { getAuthUrl } from "@/app/lib/spotify/auth";

export async function initiateSpotifyLogin(): Promise<
  { success: true; url: string } | { success: false; error: string }
> {
  try {
    const authUrl = await getAuthUrl();
    return { success: true, url: authUrl };
  } catch (error) {
    console.error("Failed to generate Spotify auth URL:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to initialize Spotify login",
    };
  }
}
