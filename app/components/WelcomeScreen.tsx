"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        {/* Worm Mascot */}
        <div className="relative w-48 h-48 mx-auto animate-in zoom-in duration-1000">
          <Image
            src="/images/worm.svg"
            alt="Worm Mascot"
            fill
            className="object-contain"
            priority={true}
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <h1 className="text-4xl font-bold text-primary-foreground squiggly-underline inline-block font-playpen">
            Welcome to De Worm!
          </h1>

          <p className="text-xl mt-4 text-primary-foreground font-playpen">
            Hi there! I&apos;m{" "}
            <span className="text-secondary font-bold">Worm</span>, your
            friendly earworm expert!
          </p>

          <p className="mt-2 text-accent-a font-playpen">
            Got a song stuck in your head? I&apos;m here to help you replace it
            with something even catchier!
          </p>

          <Card className="mt-6 bg-accent-b/30 border-secondary/20">
            <CardContent className="p-4">
              <p className="text-sm text-primary-foreground font-playpen">
                We&apos;ll need to connect to your Spotify account to find the
                perfect replacement song. Don&apos;t worry, we only use this to
                play music for you!
              </p>
            </CardContent>
          </Card>
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
