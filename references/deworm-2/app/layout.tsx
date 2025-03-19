import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Playpen_Sans } from "next/font/google"
import { ToastContainer } from "@/components/ui/toast"
import { SpeechBubbleImage } from "@/components/ui/speech-bubble-image"

const playpen = Playpen_Sans({
  subsets: ["latin"],
  variable: "--font-playpen",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DeWorm - The Earworm Cure",
  description: "Cure your earworms with our catchy song replacement therapy!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playpen.variable}>
      <body>
        <SpeechBubbleImage />
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}



import './globals.css'