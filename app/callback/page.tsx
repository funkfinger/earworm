"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("Auth error:", error);
        router.push("/?error=authentication_failed");
        return;
      }

      if (!code) {
        console.error("No code received");
        router.push("/?error=no_code");
        return;
      }

      try {
        const response = await fetch(`/api/auth/callback?code=${code}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        // Successful login, redirect to home with user data
        router.push("/?login=success");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/?error=token_exchange_failed");
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#2A1810] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Logging you in...</p>
      </div>
    </div>
  );
}
