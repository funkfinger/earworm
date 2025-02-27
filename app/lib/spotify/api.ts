// Spotify API endpoints
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
// DeWorm playlist ID
const DEWORM_PLAYLIST_ID = "0E9WYGYWZBqfmp6eJ0Nl1t";

/**
 * Search for tracks on Spotify
 */
export async function searchTracks(query: string, token: string) {
  if (!query || !token) {
    throw new Error("Missing required parameters");
  }

  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to search tracks");
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
}

/**
 * Get track details by ID
 */
export async function getTrack(trackId: string, token: string) {
  if (!trackId || !token) {
    throw new Error("Missing required parameters");
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get track details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting track details:", error);
    throw error;
  }
}

/**
 * Get user's access token from cookies or session
 */
export async function getAccessToken() {
  try {
    const response = await fetch("/api/auth/token");

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

/**
 * Add a track to the DeWorm playlist
 */
export async function addTrackToDeWormPlaylist(
  trackUri: string,
  token: string
) {
  if (!trackUri || !token) {
    throw new Error("Missing required parameters");
  }

  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${DEWORM_PLAYLIST_ID}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
          position: 0, // Add to the top of the playlist
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to add track to playlist"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
}
