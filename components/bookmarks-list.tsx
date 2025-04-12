"use client"

import { useState } from "react"
import { BookmarkPlus, Trash2, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Starship } from "@/types/starship"

interface BookmarksListProps {
  bookmarks: Starship[]
  theme: "empire" | "rebellion"
  onSelectShip: (ship: Starship) => void
  onRemoveBookmark: (shipId: string) => void
}

export default function BookmarksList({ bookmarks, theme, onSelectShip, onRemoveBookmark }: BookmarksListProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)
  const [expandedShipId, setExpandedShipId] = useState<string | null>(null)

  const themeClasses = {
    panelBg: theme === "empire" ? "bg-empire-panel" : "bg-rebellion-panel",
    panelDarkBg: theme === "empire" ? "bg-empire-panel-dark" : "bg-rebellion-panel-dark",
    accent: theme === "empire" ? "text-empire-accent" : "text-rebellion-accent",
    accentBg: theme === "empire" ? "bg-empire-accent" : "bg-rebellion-accent",
    border: theme === "empire" ? "border-empire-border" : "border-rebellion-border",
    text: theme === "empire" ? "text-empire-text" : "text-rebellion-text",
    textMuted: theme === "empire" ? "text-empire-text-muted" : "text-rebellion-text-muted",
    buttonGradient:
      theme === "empire"
        ? "bg-gradient-to-r from-empire-accent to-empire-accent-dark"
        : "bg-gradient-to-r from-rebellion-accent to-rebellion-accent-dark",
    buttonHover:
      theme === "empire"
        ? "hover:from-empire-accent-light hover:to-empire-accent"
        : "hover:from-rebellion-accent-light hover:to-rebellion-accent",
  }

  const clearAllBookmarks = () => {
    bookmarks.forEach((bookmark) => onRemoveBookmark(bookmark.id))
    setIsConfirmingClear(false)
  }

  const toggleExpand = (shipId: string) => {
    if (expandedShipId === shipId) {
      setExpandedShipId(null)
    } else {
      setExpandedShipId(shipId)
    }
  }

  return (
    <div className={`flex-grow overflow-y-auto ${themeClasses.panelBg} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`${themeClasses.accentBg} w-10 h-10 rounded-br-full flex-shrink-0`}></div>
          <h2 className={`text-2xl md:text-3xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase ml-4`}>
            Bookmarked Ships
          </h2>
        </div>

        {!isConfirmingClear ? (
          <button
            onClick={() => setIsConfirmingClear(true)}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            disabled={bookmarks.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="font-sci-fi text-sm">Clear All</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className={`${themeClasses.textMuted} text-sm`}>Confirm clear?</span>
            <button
              onClick={clearAllBookmarks}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => setIsConfirmingClear(false)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors duration-200"
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
        {bookmarks.length === 0 ? (
          <div className="p-8 text-center">
            <BookmarkPlus className={`h-12 w-12 ${themeClasses.textMuted} mx-auto mb-4 opacity-50`} />
            <p className={`${themeClasses.textMuted} font-sci-fi`}>No bookmarks available</p>
            <p className={`${themeClasses.textMuted} text-sm mt-2`}>Bookmark ships to quickly access them later</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {bookmarks.map((ship) => (
              <motion.li
                key={ship.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-l-4 ${expandedShipId === ship.id ? themeClasses.accentBorder : "border-transparent"}`}
              >
                <div
                  className={`p-4 hover:bg-black hover:bg-opacity-30 cursor-pointer transition-colors duration-200`}
                  onClick={() => toggleExpand(ship.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 transform rotate-45 ${
                          expandedShipId === ship.id ? themeClasses.accentBg : `border ${themeClasses.accentBorder}`
                        } mr-3`}
                      ></div>
                      <span className={`${themeClasses.text} font-sci-fi`}>{ship.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs ${themeClasses.textMuted} mr-3`}>{ship.class}</span>
                      <ChevronRight
                        className={`h-4 w-4 ${themeClasses.textMuted} transition-transform duration-200 ${
                          expandedShipId === ship.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedShipId === ship.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 bg-black bg-opacity-20">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className={`text-xs ${themeClasses.textMuted}`}>Manufacturer</div>
                            <div className={`${themeClasses.text}`}>{ship.manufacturer}</div>
                          </div>
                          <div>
                            <div className={`text-xs ${themeClasses.textMuted}`}>Faction</div>
                            <div className={`${themeClasses.text}`}>{ship.faction}</div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectShip(ship)
                            }}
                            className={`${themeClasses.buttonGradient} ${themeClasses.buttonHover} text-white px-4 py-2 rounded-md text-sm transition-all duration-200`}
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemoveBookmark(ship.id)
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 border border-gray-800 rounded-lg bg-black bg-opacity-30">
        <h3 className={`${themeClasses.accent} font-sci-fi mb-3`}>Collection Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Total Bookmarks</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>{bookmarks.length}</div>
          </div>
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Primary Faction</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>
              {bookmarks.length > 0
                ? (() => {
                    const factions = bookmarks.map((b) => b.faction)
                    const counts = factions.reduce(
                      (acc, faction) => {
                        acc[faction] = (acc[faction] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    )
                    const primaryFaction = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                    return primaryFaction
                  })()
                : "None"}
            </div>
          </div>
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Most Common Class</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>
              {bookmarks.length > 0
                ? (() => {
                    const classes = bookmarks.map((b) => b.class)
                    const counts = classes.reduce(
                      (acc, cls) => {
                        acc[cls] = (acc[cls] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    )
                    const primaryClass = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                    return primaryClass
                  })()
                : "None"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
