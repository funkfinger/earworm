"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SpotifyLoginButton from "./components/SpotifyLoginButton";
import UserProfile from "./components/UserProfile";

interface User {
  display_name: string;
  images: { url: string }[];
}

interface HomeProps {
  initialUser?: User | null;
}

export default function Home({ initialUser = null }: HomeProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error or success params from callback
    const error = searchParams?.get("error");
    const loginSuccess = searchParams?.get("login") === "success";

    if (error) {
      setError(error.replace(/_/g, " "));
    } else if (loginSuccess) {
      // Fetch user profile after successful login
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            throw new Error(data.error || "Failed to load user profile");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          setError(err.message || "Failed to load user profile");
        });
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setUser(null);
      } else {
        throw new Error(data.error || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error instanceof Error ? error.message : "Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-[#2A1810] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            {user ? <UserProfile user={user} onLogout={handleLogout} /> : null}
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-yellow-300 to-pink-500 text-transparent bg-clip-text">
            DeWorm
          </h1>
          <p className="text-xl text-yellow-100/80">
            Discover and remove those pesky earworms with the power of music
          </p>
          {error && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
              {error}
            </div>
          )}
          {!user && (
            <div className="mt-8">
              <SpotifyLoginButton />
            </div>
          )}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#3C2218] p-6 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <h2
                data-testid="feature-identify"
                className="text-pink-400 text-lg font-semibold mb-2"
              >
                Identify
              </h2>
              <p className="text-yellow-100/60">
                Find that tune stuck in your head
              </p>
            </div>
            <div className="bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <h2
                data-testid="feature-listen"
                className="text-yellow-400 text-lg font-semibold mb-2"
              >
                Listen
              </h2>
              <p className="text-yellow-100/60">Play it out of your system</p>
            </div>
            <div className="bg-[#3C2218] p-6 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <h2
                data-testid="feature-move-on"
                className="text-pink-400 text-lg font-semibold mb-2"
              >
                Move On
              </h2>
              <p className="text-yellow-100/60">Free your mind for new music</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/examples/error-boundary"
              className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors"
            >
              View ErrorBoundary Examples
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
