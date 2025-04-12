"use client"

import type * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "empire" | "rebellion"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("rebellion")

  // Load theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("starship-theme") as Theme | null
    if (savedTheme && (savedTheme === "empire" || savedTheme === "rebellion")) {
      setTheme(savedTheme)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("starship-theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
