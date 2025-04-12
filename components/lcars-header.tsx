"use client"

import { useState, useEffect } from "react"
import { Menu, Info, AlertTriangle, Bell } from "lucide-react"
import { motion } from "framer-motion"

interface LcarsHeaderProps {
  theme: "empire" | "rebellion"
}

export default function LcarsHeader({ theme }: LcarsHeaderProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [notifications, setNotifications] = useState<string[]>([
    "Database update complete",
    "New tactical data available",
    "System maintenance scheduled",
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const themeClasses = {
    headerBg: theme === "empire" ? "bg-empire-panel-dark" : "bg-blue-950",
    accent: theme === "empire" ? "text-empire-accent" : "text-orange-500",
    accentBg: theme === "empire" ? "bg-empire-accent" : "bg-orange-500",
    accentSecondaryBg: theme === "empire" ? "bg-red-500" : "bg-red-500",
    tertiaryBg: theme === "empire" ? "bg-gray-700" : "bg-blue-600",
    border: theme === "empire" ? "border-empire-border" : "border-orange-900",
    text: theme === "empire" ? "text-empire-text" : "text-gray-200",
    textMuted: theme === "empire" ? "text-empire-text-muted" : "text-gray-400",
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 ${themeClasses.headerBg} border-b ${themeClasses.border}`}>
      <div className="container mx-auto">
        <div className="flex items-stretch h-16">
          {/* Left corner */}
          <div className={`${themeClasses.accentBg} w-16 h-16 rounded-br-full flex-shrink-0`}></div>

          {/* Main header content */}
          <div className="flex-grow flex items-center justify-between px-4">
            <div className="flex items-center">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 rounded-full hover:bg-black hover:bg-opacity-20"
              >
                <Menu className={`h-5 w-5 ${themeClasses.accent}`} />
              </button>
              <h1 className={`text-xl md:text-2xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase ml-2`}>
                Galactic Archives
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center">
                <div className={`h-1 w-10 ${themeClasses.accentBg} mr-2`}></div>
                <span className={`${themeClasses.textMuted} text-sm font-sci-fi`}>LCARS 5.2.7</span>
              </div>

              <div className="flex items-center">
                <Info className={`h-4 w-4 ${themeClasses.accent} mr-2`} />
                <span className={`${themeClasses.text} text-sm font-sci-fi`}>SECURITY: LEVEL 3</span>
              </div>

              <div className="flex items-center">
                <AlertTriangle className={`h-4 w-4 ${themeClasses.accent} mr-2`} />
                <span className={`${themeClasses.text} text-sm font-sci-fi`}>SYSTEM STATUS: NOMINAL</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-black hover:bg-opacity-20 relative"
                >
                  <Bell className={`h-5 w-5 ${themeClasses.accent}`} />
                  {notifications.length > 0 && (
                    <span
                      className={`absolute top-0 right-0 w-2 h-2 ${themeClasses.accentSecondaryBg} rounded-full`}
                    ></span>
                  )}
                </button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-64 bg-black bg-opacity-90 border border-gray-700 rounded-lg shadow-lg z-50"
                  >
                    <div className={`p-2 border-b border-gray-700 ${themeClasses.accent} font-sci-fi text-sm`}>
                      Notifications ({notifications.length})
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="p-3 border-b border-gray-800 hover:bg-black hover:bg-opacity-40 cursor-pointer"
                          >
                            <div className={`${themeClasses.text} text-sm`}>{notification}</div>
                            <div className={`${themeClasses.textMuted} text-xs mt-1`}>
                              {Math.floor(Math.random() * 60)} minutes ago
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      )}
                    </div>
                    <div className="p-2 text-center border-t border-gray-700">
                      <button
                        className={`text-xs ${themeClasses.accent} hover:underline`}
                        onClick={() => setNotifications([])}
                      >
                        Clear All
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className={`ml-4 ${themeClasses.accent} font-sci-fi text-sm hidden md:block`}>{currentTime}</div>
            </div>
          </div>

          {/* Right side elements */}
          <div className="hidden md:flex items-stretch">
            <div className={`w-8 ${theme === "empire" ? "bg-red-500" : "bg-red-500"} flex-shrink-0`}></div>
            <div className={`w-12 ${theme === "empire" ? "bg-red-700" : "bg-blue-600"} flex-shrink-0`}></div>
            <div className={`w-6 ${themeClasses.accentBg} flex-shrink-0`}></div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`md:hidden border-t ${themeClasses.border} bg-black bg-opacity-90`}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <Info className={`h-4 w-4 ${themeClasses.accent} mr-2`} />
              <span className={`${themeClasses.text} text-sm font-sci-fi`}>SECURITY: LEVEL 3</span>
            </div>

            <div className="flex items-center">
              <AlertTriangle className={`h-4 w-4 ${themeClasses.accent} mr-2`} />
              <span className={`${themeClasses.text} text-sm font-sci-fi`}>SYSTEM STATUS: NOMINAL</span>
            </div>

            <div className="flex items-center">
              <div className={`h-1 w-10 ${themeClasses.accentBg} mr-2`}></div>
              <span className={`${themeClasses.textMuted} text-sm font-sci-fi`}>LCARS 5.2.7</span>
            </div>

            <div className={`${themeClasses.accent} font-sci-fi text-sm text-center`}>{currentTime}</div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
