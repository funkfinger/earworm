export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  uri: string;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export async function searchSpotifyTracks(
  query: string
): Promise<SpotifyTrack[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `/api/spotify/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data: SpotifySearchResponse = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Failed to search Spotify:", error);
    throw error;
  }
}
