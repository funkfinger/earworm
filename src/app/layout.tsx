import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "./amplify-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Earworm - Your Music Companion",
  description: "Track your favorite songs and listening history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
