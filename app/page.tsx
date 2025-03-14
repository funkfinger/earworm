import { cookies } from "next/headers";
import SearchForm from "./components/SearchForm";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("spotify_access_token");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!isAuthenticated ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to DeWorm</h1>
          <p className="mb-8">
            Connect with Spotify to start finding replacement songs for your
            earworms.
          </p>
          <a
            href="/api/auth/spotify"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            Connect with Spotify
          </a>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">DeWorm</h1>
            <a
              href="/api/auth/logout"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </a>
          </div>
          <SearchForm />
        </div>
      )}
    </main>
  );
}
