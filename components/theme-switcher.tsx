"use client"

import { motion } from "framer-motion"
import { EmpireIcon, RebellionIcon } from "./faction-icons"

interface ThemeSwitcherProps {
  activeTheme: "empire" | "rebellion"
  setActiveTheme: (theme: "empire" | "rebellion") => void
}

export default function ThemeSwitcher({ activeTheme, setActiveTheme }: ThemeSwitcherProps) {
  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="flex items-center justify-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-full">
        <button
          onClick={() => setActiveTheme("rebellion")}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeTheme === "rebellion" ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Switch to Rebellion theme"
        >
          {activeTheme === "rebellion" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId="themeIndicator"
            >
              <div className="absolute inset-0 rounded-full bg-orange-500 opacity-50 animate-pulse"></div>
            </motion.div>
          )}
          <RebellionIcon className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTheme("empire")}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeTheme === "empire" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Switch to Empire theme"
        >
          {activeTheme === "empire" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId="themeIndicator"
            >
              <div className="absolute inset-0 rounded-full bg-red-600 opacity-50 animate-pulse"></div>
            </motion.div>
          )}
          <EmpireIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
