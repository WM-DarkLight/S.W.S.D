"use client"

import { useState, useEffect } from "react"
import { Search, X, ChevronDown, ChevronUp, Filter, BookmarkPlus, History, BarChart3 } from "lucide-react"
import { starshipData } from "@/data/starships"
import StarshipList from "./starship-list"
import StarshipDetail from "./starship-detail"
import StarshipComparison from "./starship-comparison"
import SearchHistory from "./search-history"
import BookmarksList from "./bookmarks-list"
import type { Starship } from "@/types/starship"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface StarshipDatabaseProps {
  theme: "empire" | "rebellion"
}

export default function StarshipDatabase({ theme }: StarshipDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFaction, setSelectedFaction] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("")
  const [filteredShips, setFilteredShips] = useState<Starship[]>(starshipData)
  const [selectedShip, setSelectedShip] = useState<Starship | null>(null)
  const [currentDate, setCurrentDate] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState<"detail" | "compare" | "history" | "bookmarks">("detail")
  const [comparisonShips, setComparisonShips] = useState<Starship[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [bookmarks, setBookmarks] = useState<Starship[]>([])
  const { toast } = useToast()

  // Get unique values for filters
  const factions = [...new Set(starshipData.map((ship) => ship.faction))].sort()
  const classes = [...new Set(starshipData.map((ship) => ship.class))].sort()
  const manufacturers = [...new Set(starshipData.map((ship) => ship.manufacturer))].sort()

  useEffect(() => {
    // Set galactic standard time
    const now = new Date()
    const year = now.getFullYear()
    const startOfYear = new Date(Date.UTC(year, 0, 1))
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    setCurrentDate(`${year}.${dayOfYear.toString().padStart(3, "0")}`)

    // Filter ships
    filterShips()

    // Load saved data from localStorage
    const savedBookmarks = localStorage.getItem("starship-bookmarks")
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks)
        setBookmarks(parsedBookmarks)
      } catch (e) {
        console.error("Failed to parse bookmarks", e)
      }
    }

    const savedHistory = localStorage.getItem("starship-search-history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setSearchHistory(parsedHistory)
      } catch (e) {
        console.error("Failed to parse search history", e)
      }
    }
  }, [])

  useEffect(() => {
    filterShips()

    // Add non-empty search terms to history
    if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
      const newHistory = [searchTerm.trim(), ...searchHistory].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem("starship-search-history", JSON.stringify(newHistory))
    }
  }, [searchTerm, selectedFaction, selectedClass, selectedManufacturer])

  const filterShips = () => {
    const filtered = starshipData.filter((ship) => {
      const nameMatch = ship.name.toLowerCase().includes(searchTerm.toLowerCase())
      const modelMatch = ship.model?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const factionMatch = !selectedFaction || ship.faction === selectedFaction
      const classMatch = !selectedClass || ship.class === selectedClass
      const manufacturerMatch = !selectedManufacturer || ship.manufacturer === selectedManufacturer

      return (nameMatch || modelMatch) && factionMatch && classMatch && manufacturerMatch
    })

    setFilteredShips(filtered)

    // Clear selection if the selected ship is no longer in filtered results
    if (selectedShip && !filtered.find((ship) => ship.id === selectedShip.id)) {
      setSelectedShip(null)
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedFaction("")
    setSelectedClass("")
    setSelectedManufacturer("")
  }

  const addToComparison = (ship: Starship) => {
    if (comparisonShips.length >= 3) {
      toast({
        title: "Comparison Limit Reached",
        description: "You can compare up to 3 starships at once. Remove a ship before adding another.",
        variant: "destructive",
      })
      return
    }

    if (!comparisonShips.find((s) => s.id === ship.id)) {
      const newComparisonShips = [...comparisonShips, ship]
      setComparisonShips(newComparisonShips)
      toast({
        title: "Added to Comparison",
        description: `${ship.name} has been added to comparison.`,
      })

      if (newComparisonShips.length >= 2 && activeView !== "compare") {
        setActiveView("compare")
      }
    }
  }

  const removeFromComparison = (shipId: string) => {
    const newComparisonShips = comparisonShips.filter((ship) => ship.id !== shipId)
    setComparisonShips(newComparisonShips)

    if (newComparisonShips.length < 2 && activeView === "compare") {
      setActiveView("detail")
    }
  }

  const toggleBookmark = (ship: Starship) => {
    const isBookmarked = bookmarks.some((b) => b.id === ship.id)

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((b) => b.id !== ship.id)
      setBookmarks(newBookmarks)
      localStorage.setItem("starship-bookmarks", JSON.stringify(newBookmarks))
      toast({
        title: "Bookmark Removed",
        description: `${ship.name} has been removed from your bookmarks.`,
      })
    } else {
      const newBookmarks = [...bookmarks, ship]
      setBookmarks(newBookmarks)
      localStorage.setItem("starship-bookmarks", JSON.stringify(newBookmarks))
      toast({
        title: "Bookmark Added",
        description: `${ship.name} has been added to your bookmarks.`,
      })
    }
  }

  const isBookmarked = (shipId: string) => {
    return bookmarks.some((b) => b.id === shipId)
  }

  const applySearchFromHistory = (term: string) => {
    setSearchTerm(term)
  }

  const themeClasses = {
    mainBg: theme === "empire" ? "bg-empire-space" : "bg-rebellion-space",
    panelBg: theme === "empire" ? "bg-empire-panel" : "bg-rebellion-panel",
    panelDarkBg: theme === "empire" ? "bg-empire-panel-dark" : "bg-rebellion-panel-dark",
    panelLightBg: theme === "empire" ? "bg-empire-panel-light" : "bg-rebellion-panel-light",
    accent: theme === "empire" ? "text-empire-accent" : "text-rebellion-accent",
    accentBg: theme === "empire" ? "bg-empire-accent" : "bg-rebellion-accent",
    accentBorder: theme === "empire" ? "border-empire-accent" : "border-rebellion-accent",
    accentGlow: theme === "empire" ? "shadow-empire-glow" : "shadow-rebellion-glow",
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

  return (
    <div className="flex flex-col min-h-screen py-20 px-4">
      {/* Holographic overlay effect */}
      <div
        className={`fixed inset-0 ${theme === "empire" ? "bg-empire-scanline" : "bg-rebellion-scanline"} pointer-events-none z-10`}
      ></div>

      <div className="container mx-auto flex flex-col flex-grow">
        <motion.div
          className={`${themeClasses.panelBg} border ${themeClasses.border} rounded-lg overflow-hidden flex flex-col flex-grow shadow-lg relative`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* LCARS-inspired top bar */}
          <div className={`${themeClasses.panelDarkBg} relative overflow-hidden`}>
            <div className="flex items-stretch">
              {/* Left rounded element */}
              <div className={`${themeClasses.accentBg} w-16 h-16 rounded-br-full flex-shrink-0`}></div>

              {/* Title section */}
              <div className="flex-grow px-4 py-3 flex flex-col justify-center">
                <h1 className={`text-2xl md:text-3xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase mb-1`}>
                  Galactic Archives // Starship Database
                </h1>
                <div className="flex items-center">
                  <div className={`h-1 w-20 ${themeClasses.accentBg} mr-3`}></div>
                  <p className={`${themeClasses.textMuted} text-sm uppercase tracking-wider`}>
                    Access Node: {theme === "empire" ? "IMP-HQ1" : "REB-HQ7"} // User: Guest
                  </p>
                </div>
              </div>

              {/* Right rounded elements - LCARS style */}
              <div className="hidden md:flex items-stretch">
                <div className={`w-8 ${theme === "empire" ? "bg-red-500" : "bg-yellow-500"} flex-shrink-0`}></div>
                <div className={`w-12 ${theme === "empire" ? "bg-red-700" : "bg-orange-500"} flex-shrink-0`}></div>
                <div className={`w-6 ${themeClasses.accentBg} flex-shrink-0`}></div>
              </div>
            </div>

            {/* Animated tech line */}
            <div className={`h-1 w-full ${themeClasses.accentBg} relative overflow-hidden`}>
              <div className="absolute inset-0 tech-line-animation"></div>
            </div>
          </div>

          {/* View selector tabs - LCARS style */}
          <div className="flex overflow-x-auto bg-black bg-opacity-40 border-b border-gray-800">
            <div className={`${themeClasses.accentBg} w-8 h-12 rounded-br-full flex-shrink-0`}></div>

            <button
              onClick={() => setActiveView("detail")}
              className={`px-6 h-12 flex items-center font-sci-fi uppercase text-sm transition-colors duration-200 ${
                activeView === "detail"
                  ? `${themeClasses.accentBg} text-white font-bold`
                  : "bg-transparent text-gray-300 hover:bg-black hover:bg-opacity-30"
              }`}
            >
              Ship Details
            </button>

            <div className="w-2"></div>

            <button
              onClick={() => setActiveView("compare")}
              className={`px-6 h-12 flex items-center font-sci-fi uppercase text-sm transition-colors duration-200 ${
                activeView === "compare"
                  ? `${themeClasses.accentBg} text-white font-bold`
                  : "bg-transparent text-gray-300 hover:bg-black hover:bg-opacity-30"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare ({comparisonShips.length})
            </button>

            <div className="w-2"></div>

            <button
              onClick={() => setActiveView("history")}
              className={`px-6 h-12 flex items-center font-sci-fi uppercase text-sm transition-colors duration-200 ${
                activeView === "history"
                  ? `${themeClasses.accentBg} text-white font-bold`
                  : "bg-transparent text-gray-300 hover:bg-black hover:bg-opacity-30"
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              Search History
            </button>

            <div className="w-2"></div>

            <button
              onClick={() => setActiveView("bookmarks")}
              className={`px-6 h-12 flex items-center font-sci-fi uppercase text-sm transition-colors duration-200 ${
                activeView === "bookmarks"
                  ? `${themeClasses.accentBg} text-white font-bold`
                  : "bg-transparent text-gray-300 hover:bg-black hover:bg-opacity-30"
              }`}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Bookmarks ({bookmarks.length})
            </button>

            <div className="flex-grow"></div>

            <div className={`${theme === "empire" ? "bg-red-700" : "bg-orange-500"} w-6 h-12 flex-shrink-0`}></div>
            <div className={`${themeClasses.accentBg} w-4 h-12 flex-shrink-0`}></div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-between w-full p-4 bg-black bg-opacity-40 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="font-sci-fi uppercase tracking-wider">Starship Registry</span>
            {isMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {/* Search bar - Always visible */}
          <div className={`${themeClasses.panelLightBg} border-b ${themeClasses.border} p-4`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-grow">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${themeClasses.accentBg} rounded-l-md`}></div>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="search"
                  placeholder="Enter Designation Query..."
                  className={`w-full bg-black bg-opacity-60 ${themeClasses.text} pl-12 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 ${themeClasses.accentBorder} placeholder-gray-500`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`${themeClasses.buttonGradient} ${themeClasses.buttonHover} text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200`}
              >
                <Filter className="h-5 w-5" />
                <span className="font-sci-fi">Filters</span>
                {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {(searchTerm || selectedFaction || selectedClass || selectedManufacturer) && (
                <button
                  onClick={resetFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                  <span className="font-sci-fi">Reset</span>
                </button>
              )}
            </div>

            {/* Filter count badge */}
            <div className={`mt-3 ${themeClasses.text} font-sci-fi text-sm`}>
              <span className={themeClasses.accent}>[{filteredShips.length}]</span> Starships Found
            </div>

            {/* Filters panel - Expandable */}
            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="space-y-2">
                      <label className={`block text-sm font-sci-fi ${themeClasses.accent}`}>► Affiliation Filter</label>
                      <div className="relative">
                        <select
                          className={`w-full bg-black bg-opacity-60 ${themeClasses.text} px-4 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 ${themeClasses.accentBorder}`}
                          value={selectedFaction}
                          onChange={(e) => setSelectedFaction(e.target.value)}
                        >
                          <option value="">-- All Affiliations --</option>
                          {factions.map((faction) => (
                            <option key={faction} value={faction}>
                              {faction}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-sci-fi ${themeClasses.accent}`}>► Class Filter</label>
                      <div className="relative">
                        <select
                          className={`w-full bg-black bg-opacity-60 ${themeClasses.text} px-4 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 ${themeClasses.accentBorder}`}
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value="">-- All Classes --</option>
                          {classes.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-sci-fi ${themeClasses.accent}`}>
                        ► Manufacturer Filter
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full bg-black bg-opacity-60 ${themeClasses.text} px-4 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 ${themeClasses.accentBorder}`}
                          value={selectedManufacturer}
                          onChange={(e) => setSelectedManufacturer(e.target.value)}
                        >
                          <option value="">-- All Manufacturers --</option>
                          {manufacturers.map((manufacturer) => (
                            <option key={manufacturer} value={manufacturer}>
                              {manufacturer}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <StarshipList
              ships={filteredShips}
              selectedShipId={selectedShip?.id}
              onSelectShip={(ship) => {
                setSelectedShip(ship)
                if (activeView !== "detail") {
                  setActiveView("detail")
                }
              }}
              theme={theme}
              isVisible={isMenuOpen}
              onAddToComparison={addToComparison}
              onToggleBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
            />

            <AnimatePresence mode="wait">
              {activeView === "detail" && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow"
                >
                  <StarshipDetail
                    ship={selectedShip}
                    theme={theme}
                    onAddToComparison={addToComparison}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={selectedShip ? isBookmarked(selectedShip.id) : false}
                  />
                </motion.div>
              )}

              {activeView === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow"
                >
                  <StarshipComparison ships={comparisonShips} theme={theme} onRemoveShip={removeFromComparison} />
                </motion.div>
              )}

              {activeView === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow"
                >
                  <SearchHistory
                    history={searchHistory}
                    theme={theme}
                    onSelectTerm={applySearchFromHistory}
                    onClearHistory={() => {
                      setSearchHistory([])
                      localStorage.removeItem("starship-search-history")
                    }}
                  />
                </motion.div>
              )}

              {activeView === "bookmarks" && (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow"
                >
                  <BookmarksList
                    bookmarks={bookmarks}
                    theme={theme}
                    onSelectShip={(ship) => {
                      setSelectedShip(ship)
                      setActiveView("detail")
                    }}
                    onRemoveBookmark={(shipId) => {
                      const newBookmarks = bookmarks.filter((b) => b.id !== shipId)
                      setBookmarks(newBookmarks)
                      localStorage.setItem("starship-bookmarks", JSON.stringify(newBookmarks))
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer - LCARS inspired */}
        <div className={`mt-4 ${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
          <div className="flex items-stretch">
            {/* Left rounded element */}
            <div className={`${themeClasses.accentBg} w-12 h-12 rounded-br-full flex-shrink-0`}></div>

            {/* Center content */}
            <div className="flex-grow flex items-center justify-center py-3">
              <div className={`h-1 w-16 ${themeClasses.accentBg} mr-4`}></div>
              <span className={`${themeClasses.textMuted} text-sm font-sci-fi`}>
                Galactic Archives v4.2 | GST: <span className={themeClasses.accent}>{currentDate}</span>
              </span>
              <div className={`h-1 w-16 ${themeClasses.accentBg} ml-4`}></div>
            </div>

            {/* Right rounded elements - LCARS style */}
            <div className="hidden md:flex items-stretch">
              <div className={`w-6 ${theme === "empire" ? "bg-red-700" : "bg-orange-500"} flex-shrink-0`}></div>
              <div className={`w-10 ${themeClasses.accentBg} flex-shrink-0`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
