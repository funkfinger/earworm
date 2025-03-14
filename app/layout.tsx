import "./globals.css";
import { Playpen_Sans } from "next/font/google";

const playpenSans = Playpen_Sans({
  subsets: ["latin"],
  variable: "--font-playpen",
});

export const metadata = {
  title: "Earworm",
  description: "Get that song out of your head",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playpenSans.variable}>
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
