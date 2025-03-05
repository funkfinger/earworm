"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "@/utils/amplifyClient";

interface History {
  id: string;
  userId: string;
  songId: string;
  timestamp: string;
  song?: {
    id: string;
    title: string;
    artist: string;
  };
}

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
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

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await client.models.History.list({
        filter: { userId: { eq: userId } },
        includeInfo: {
          song: true,
        },
      });

      // Sort by timestamp (newest first)
      const sortedHistory = [...response.data].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setHistory(sortedHistory);
    } catch (err) {
      console.error("Error fetching history:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching history");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await client.models.History.delete({ id });
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting history item:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while deleting the history item");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Listening History
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>
              No listening history yet. Go to your songs and mark them as
              listened!
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {history.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">
                        {item.song?.title || "Unknown Song"}
                      </h3>
                      <p className="text-gray-600">
                        {item.song?.artist || "Unknown Artist"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Listened on: {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Remove
                    </button>
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
