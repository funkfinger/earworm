"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to Spotify login screen
    router.push("/login");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-primary text-primary-foreground"
      role="main"
    >
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* QT Mascot */}
        <div className="my-4">
          <Image
            src="/mascot.svg"
            alt="QT Mascot"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <h1 className="text-4xl font-bold text-primary-foreground squiggly-underline inline-block font-playpen">
            Welcome to De Worm!
          </h1>

          <p className="text-xl mt-4 text-primary-foreground font-playpen">
            Hi there! I&apos;m{" "}
            <span className="text-secondary font-bold">QT</span>, your friendly
            earworm expert!
          </p>

          <p className="mt-2 text-accent-a font-playpen">
            Got a song stuck in your head? I&apos;m here to help you replace it
            with something even catchier!
          </p>

          <div className="handdrawn-card mt-6 bg-accent-b/30 text-secondary">
            <div className="p-4">
              <p className="text-sm text-primary-foreground font-playpen">
                We&apos;ll need to connect to your Spotify account to find the
                perfect replacement song. Don&apos;t worry, we only use this to
                play music for you!
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="w-full bg-secondary hover:bg-secondary-hover text-primary font-playpen"
          >
            Let&apos;s Get Started!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
