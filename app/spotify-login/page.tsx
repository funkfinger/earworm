"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /login page
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-primary text-primary-foreground">
      <p>Redirecting to login page...</p>
    </div>
  );
}
