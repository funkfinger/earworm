import type { Metadata } from "next";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${playpenSans.variable} font-playpen bg-background text-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
