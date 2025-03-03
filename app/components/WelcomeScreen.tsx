"use client";

import React from "react";
import Image from "next/image";
import Button from "./Button";
import { useRouter } from "next/navigation";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to Spotify login screen
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="max-w-md w-full space-y-8 bounce-settle">
        {/* QT Mascot */}
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/images/qt-mascot.svg"
            alt="QT Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground squiggly-underline inline-block">
            Welcome to De Worm!
          </h1>

          <p className="text-xl mt-4">
            Hi there! I&apos;m{" "}
            <span className="text-highlight font-bold">QT</span>, your friendly
            earworm expert!
          </p>

          <p className="mt-2">
            Got a song stuck in your head that just won&apos;t go away? I&apos;m
            here to help you replace it with something even catchier!
          </p>

          <div className="hand-drawn-border p-4 mt-6 bg-background/30">
            <p className="text-sm">
              We&apos;ll need to connect to your Spotify account to find the
              perfect replacement song. Don&apos;t worry, we only use this to
              play music for you!
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mt-8">
          <Button
            onClick={handleGetStarted}
            variant="primary"
            size="lg"
            fullWidth
          >
            Let&apos;s Get Started!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
