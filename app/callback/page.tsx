"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleTokenExchange } from "../actions/auth";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("Authorization error:", error);
        router.push("/?error=spotify_auth_failed");
        return;
      }

      if (!code) {
        console.error("No authorization code received");
        router.push("/?error=no_code");
        return;
      }

      try {
        await handleTokenExchange(code);
        router.push("/dashboard"); // Redirect to dashboard after successful login
      } catch (error) {
        console.error("Token exchange error:", error);
        router.push("/?error=token_exchange_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging you in...</h1>
        <div
          role="status"
          aria-label="Loading"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"
        />
      </div>
    </div>
  );
}
