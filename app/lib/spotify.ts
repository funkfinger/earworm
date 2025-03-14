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
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  uri: string;
}

export async function searchSpotifyTracks(
  query: string
): Promise<SpotifyTrack[]> {
  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to search tracks");
  }

  const data = await response.json();
  return data.tracks.items;
}

export async function getRandomReplacementTrack(): Promise<SpotifyTrack> {
  const response = await fetch(`/api/spotify/replacement-track`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get replacement track");
  }

  return await response.json();
}
