"use client";

import { useState } from "react";
import { initiateSpotifyLogin } from "@/app/actions/auth";

interface SpotifyLoginButtonProps {
  onLogin?: (result: { success: true; url: string }) => void;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export default function SpotifyLoginButton({
  onLogin,
  isLoading: externalLoading = false,
  hasError: externalError = false,
  errorMessage: externalErrorMessage = "",
}: SpotifyLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Add a small delay to ensure state updates are processed
      await new Promise((resolve) => setTimeout(resolve, 0));

      const result = await initiateSpotifyLogin();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Call onLogin with the successful result
      onLogin?.(result);

      // Redirect to Spotify auth page
      if (typeof window !== "undefined") {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to Spotify"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingState = isLoading || externalLoading;
  const hasError = error.length > 0 || externalError;
  const errorMessageToShow = error || externalErrorMessage;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLogin}
        disabled={isLoadingState}
        data-testid="spotify-login-button"
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white
          transition-all duration-200
          ${
            hasError
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#1DB954] hover:bg-[#1ed760]"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {!isLoadingState && !hasError && (
          <svg
            data-testid="spotify-icon"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.53-1.122.3-3.071-1.891-6.93-2.312-11.48-1.271-.431.091-.852-.211-.972-.63-.121-.421.211-.842.63-.962 4.971-1.141 9.221-.642 12.673 1.441.402.201.542.722.271 1.122zm1.471-3.261c-.301.452-.921.642-1.372.361-3.512-2.162-8.863-2.792-13.014-1.531-.512.151-1.052-.12-1.202-.632-.15-.512.12-1.052.632-1.202C9.8 9.55 15.72 10.27 19.722 12.72c.361.181.512.901.27 1.361zm.129-3.403c-4.222-2.502-11.223-2.732-15.264-1.511-.614.18-1.263-.181-1.444-.796-.18-.614.181-1.263.796-1.444 4.642-1.412 12.363-1.141 17.235 1.742.533.331.743 1.052.391 1.594-.331.513-1.052.723-1.714.391z" />
          </svg>
        )}
        {isLoadingState && (
          <svg
            data-testid="loading-spinner"
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {hasError ? "Try Again" : "Login with Spotify"}
      </button>
      {hasError && errorMessageToShow && (
        <p className="text-red-500 text-sm">{errorMessageToShow}</p>
      )}
    </div>
  );
}
