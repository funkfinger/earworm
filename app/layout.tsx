import type { Metadata } from "next";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";
import "./styles/handdrawn.css";
import Script from "next/script";

const playpenSans = Playpen_Sans({
  variable: "--font-playpen",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "De Worm | Earworm Cure App",
  description: "An app that helps with songs stuck in your head (earworms)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playpenSans.variable}>
      <head>
        <Script
          src="https://sdk.scdn.co/spotify-player.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans bg-background text-text antialiased">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id="squiggly-line">
              <path d="M0,5 Q2.5,0 5,5 T10,5 T15,5 T20,5 T25,5 T30,5 T35,5 T40,5" />
            </clipPath>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
