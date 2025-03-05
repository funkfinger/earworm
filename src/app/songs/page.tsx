"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "@/utils/amplifyClient";

interface Song {
  id: string;
  title: string;
  artist: string;
  userId: string;
}

export default function Songs() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSong, setNewSong] = useState({ title: "", artist: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSongs();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(true);
      setUserId(user.userId);
    } catch (err) {
      console.error("Not authenticated:", err);
      router.push("/auth/signin");
    }
  };

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await client.models.Song.list({
        filter: { userId: { eq: userId } },
      });
      setSongs(response.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching songs");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist) return;

    try {
      const result = await client.models.Song.create({
        title: newSong.title,
        artist: newSong.artist,
        userId: userId,
      });

      setSongs([...songs, result.data]);
      setNewSong({ title: "", artist: "" });
    } catch (err) {
      console.error("Error adding song:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while adding the song");
      }
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await client.models.Song.delete({ id });
      setSongs(songs.filter((song) => song.id !== id));
    } catch (err) {
      console.error("Error deleting song:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while deleting the song");
      }
    }
  };

  const handleAddToHistory = async (songId: string) => {
    try {
      await client.models.History.create({
        userId: userId,
        songId: songId,
        timestamp: new Date().toISOString(),
      });
      alert("Added to listening history!");
    } catch (err) {
      console.error("Error adding to history:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while updating history");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">My Songs</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Song</h2>
          <form onSubmit={handleAddSong} className="flex flex-col space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={newSong.title}
                onChange={(e) =>
                  setNewSong({ ...newSong, title: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="artist"
              >
                Artist
              </label>
              <input
                id="artist"
                type="text"
                value={newSong.artist}
                onChange={(e) =>
                  setNewSong({ ...newSong, artist: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Song
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">My Song Collection</h2>
          {loading ? (
            <p>Loading songs...</p>
          ) : songs.length === 0 ? (
            <p>No songs in your collection yet. Add your first song above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {songs.map((song) => (
                <li key={song.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{song.title}</h3>
                      <p className="text-gray-600">{song.artist}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToHistory(song.id)}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Mark as Listened
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
