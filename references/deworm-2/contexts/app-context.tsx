"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AppContextType = {
  earwormSong: Song | null
  replacementSong: Song | null
  setEarwormSong: (song: Song | null) => void
  setReplacementSong: (song: Song | null) => void
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

export type Song = {
  id: string
  name: string
  artist: string
  albumArt?: string
}

const defaultContext: AppContextType = {
  earwormSong: null,
  replacementSong: null,
  setEarwormSong: () => {},
  setReplacementSong: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
}

const AppContext = createContext<AppContextType>(defaultContext)

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [earwormSong, setEarwormSong] = useState<Song | null>(null)
  const [replacementSong, setReplacementSong] = useState<Song | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <AppContext.Provider
      value={{
        earwormSong,
        replacementSong,
        setEarwormSong,
        setReplacementSong,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

