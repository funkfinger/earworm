"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";

interface UserProfile {
  display_name: string;
  email: string;
  images: { url: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/spotify/me");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/?error=session_expired");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div
            role="status"
            aria-label="Loading"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2A1810] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#3C2218] shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                {profile.images?.[0]?.url && (
                  <img
                    src={profile.images[0].url}
                    alt={profile.display_name}
                    className="h-24 w-24 rounded-full border-2 border-pink-500/20"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-pink-400">
                    {profile.display_name}
                  </h1>
                  <p className="text-yellow-100/60">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full
                         text-white font-semibold
                         hover:from-pink-600 hover:to-yellow-600 
                         transform hover:scale-105 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#2A1810]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
