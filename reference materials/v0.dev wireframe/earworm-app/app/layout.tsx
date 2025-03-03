import type React from "react"
import type { Metadata } from "next"
import { Playpen_Sans } from "next/font/google"
import "./globals.css"

const playpen = Playpen_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playpen",
})

export const metadata: Metadata = {
  title: "Earworm Remover",
  description: "Get that song out of your head!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playpen.variable} font-playpen bg-background text-foreground`}>{children}</body>
    </html>
  )
}



import './globals.css'