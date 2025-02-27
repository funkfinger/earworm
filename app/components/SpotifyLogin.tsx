"use client";

export default function SpotifyLogin() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("Missing required environment variables");
      return;
    }

    const state = Math.random().toString(36).substring(7);
    const scope = "user-read-private user-read-email";

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    window.location.assign(authUrl);
  };

  return (
    <button
      onClick={handleLogin}
      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full
                 text-white font-semibold text-lg shadow-lg
                 hover:from-pink-600 hover:to-yellow-600 
                 transform hover:scale-105 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#2A1810]"
    >
      Login with Spotify
    </button>
  );
}
