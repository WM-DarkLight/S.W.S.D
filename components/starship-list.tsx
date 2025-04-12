"use client"

import { useState, useEffect, useRef } from "react"
import type { Starship } from "@/types/starship"
import { ChevronRight, Shield, Zap, BookmarkPlus, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface StarshipListProps {
  ships: Starship[]
  selectedShipId?: string
  onSelectShip: (ship: Starship) => void
  theme: "empire" | "rebellion"
  isVisible: boolean
  onAddToComparison: (ship: Starship) => void
  onToggleBookmark: (ship: Starship) => void
  isBookmarked: (shipId: string) => boolean
}

export default function StarshipList({
  ships,
  selectedShipId,
  onSelectShip,
  theme,
  isVisible,
  onAddToComparison,
  onToggleBookmark,
  isBookmarked,
}: StarshipListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)
  const [hoveredShipId, setHoveredShipId] = useState<string | null>(null)

  useEffect(() => {
    const checkScrollable = () => {
      if (listRef.current) {
        setIsScrollable(listRef.current.scrollHeight > listRef.current.clientHeight)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)

    return () => {
      window.removeEventListener("resize", checkScrollable)
    }
  }, [ships])

  const themeClasses = {
    panelBg: theme === "empire" ? "bg-empire-panel-dark" : "bg-rebellion-panel-dark",
    panelDarkerBg: theme === "empire" ? "bg-black bg-opacity-40" : "bg-black bg-opacity-40",
    accent: theme === "empire" ? "text-empire-accent" : "text-rebellion-accent",
    accentBg: theme === "empire" ? "bg-empire-accent" : "bg-rebellion-accent",
    accentSecondary: theme === "empire" ? "text-red-500" : "text-yellow-400",
    accentSecondaryBg: theme === "empire" ? "bg-red-500" : "bg-yellow-400",
    border: theme === "empire" ? "border-empire-border" : "border-rebellion-border",
    text: theme === "empire" ? "text-empire-text" : "text-rebellion-text",
    textMuted: theme === "empire" ? "text-empire-text-muted" : "text-rebellion-text-muted",
    selectedBg: theme === "empire" ? "bg-empire-accent bg-opacity-20" : "bg-rebellion-accent bg-opacity-20",
    hoverBg:
      theme === "empire"
        ? "hover:bg-empire-accent hover:bg-opacity-10"
        : "hover:bg-rebellion-accent hover:bg-opacity-10",
  }

  return (
    <div
      className={`w-full md:w-96 border-r ${themeClasses.border} ${themeClasses.panelBg} flex-shrink-0 flex flex-col ${isVisible ? "block" : "hidden md:flex"}`}
    >
      <div className={`p-3 border-b ${themeClasses.border} ${themeClasses.panelDarkerBg} flex items-center`}>
        <div className={`w-3 h-3 rounded-full ${themeClasses.accentBg} mr-3 animate-pulse`}></div>
        <h2 className={`${themeClasses.accent} font-sci-fi text-sm uppercase tracking-wider`}>Starship Registry</h2>
      </div>

      <div ref={listRef} className="overflow-y-auto flex-grow custom-scrollbar">
        {ships.length === 0 ? (
          <div className="p-6 text-center text-red-500">
            <p className="font-sci-fi uppercase">// No Designations Match Query //</p>
          </div>
        ) : (
          <ul>
            {ships.map((ship) => (
              <motion.li
                key={ship.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-b ${themeClasses.border} cursor-pointer transition-all duration-200 group ${
                  selectedShipId === ship.id
                    ? `${themeClasses.selectedBg} border-l-4 ${themeClasses.accentBg}`
                    : `${themeClasses.hoverBg} border-l-4 border-transparent`
                }`}
                onClick={() => onSelectShip(ship)}
                onMouseEnter={() => setHoveredShipId(ship.id)}
                onMouseLeave={() => setHoveredShipId(null)}
              >
                <div className="p-3 pl-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div
                        className={`w-2 h-2 transform rotate-45 ${
                          selectedShipId === ship.id
                            ? themeClasses.accentSecondaryBg
                            : `border ${themeClasses.accent} group-hover:${themeClasses.accentSecondaryBg}`
                        }`}
                      ></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className={`${themeClasses.text} font-medium font-sci-fi`}>{ship.name}</div>
                        {isBookmarked(ship.id) && (
                          <BookmarkPlus className={`h-3 w-3 ml-2 ${themeClasses.accentSecondary}`} />
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className={`text-xs ${themeClasses.textMuted} mr-3`}>{ship.model || "Unknown Model"}</div>

                        {/* Class indicator */}
                        <div className={`text-xs ${themeClasses.accent} flex items-center`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {ship.class}
                        </div>
                      </div>

                      {/* Ship quick stats */}
                      <div className="flex items-center mt-2 space-x-3">
                        {ship.specs?.hyperdrive && (
                          <div className={`text-xs ${themeClasses.textMuted} flex items-center`}>
                            <Zap className="h-3 w-3 mr-1" />
                            {ship.specs.hyperdrive}
                          </div>
                        )}
                        {ship.specs?.length && (
                          <div className={`text-xs ${themeClasses.textMuted}`}>{ship.specs.length}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 transition-opacity ${
                        selectedShipId === ship.id
                          ? `opacity-100 ${themeClasses.accentSecondary}`
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  </div>

                  {/* Action buttons - only show on hover or selected */}
                  {(hoveredShipId === ship.id || selectedShipId === ship.id) && (
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddToComparison(ship)
                        }}
                        className={`p-1 rounded ${themeClasses.panelDarkerBg} hover:${themeClasses.accentBg} transition-colors duration-200`}
                        title="Add to comparison"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleBookmark(ship)
                        }}
                        className={`p-1 rounded ${
                          isBookmarked(ship.id) ? themeClasses.accentBg : themeClasses.panelDarkerBg
                        } hover:${themeClasses.accentBg} transition-colors duration-200`}
                        title={isBookmarked(ship.id) ? "Remove bookmark" : "Add bookmark"}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {isScrollable && (
        <div className="p-2 text-center text-xs border-t border-gray-800 bg-black bg-opacity-30">
          <span className={`${themeClasses.textMuted} animate-pulse`}>▼ Scroll for more designations ▼</span>
        </div>
      )}
    </div>
  )
}
