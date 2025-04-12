"use client"
import { useState, useEffect } from "react"
import ThemeSwitcher from "@/components/theme-switcher"
import { useTheme } from "@/components/theme-provider"
import LcarsHeader from "@/components/lcars-header"
import { Toaster } from "@/components/ui/toaster"
import ShipInformationDisplay from "@/components/ship-information-display"
import { starshipData } from "@/data/starships"
import { Search, Filter, ChevronDown, ChevronUp, X, BarChart3, Star } from "lucide-react"
import type { Starship } from "@/types/starship"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const activeTheme = theme as "empire" | "rebellion"
  const [selectedShip, setSelectedShip] = useState(starshipData[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFaction, setSelectedFaction] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [filteredShips, setFilteredShips] = useState<Starship[]>(starshipData)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [comparisonShips, setComparisonShips] = useState<Starship[]>([])
  const [favoriteShips, setFavoriteShips] = useState<string[]>([])
  const [activeView, setActiveView] = useState<"detail" | "compare">("detail")

  // Get unique values for filters
  const factions = [...new Set(starshipData.map((ship) => ship.faction))].sort()
  const classes = [...new Set(starshipData.map((ship) => ship.class))].sort()

  useEffect(() => {
    // Filter ships
    const filtered = starshipData.filter((ship) => {
      const nameMatch = ship.name.toLowerCase().includes(searchTerm.toLowerCase())
      const modelMatch = ship.model?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const factionMatch = !selectedFaction || ship.faction === selectedFaction
      const classMatch = !selectedClass || ship.class === selectedClass

      return (nameMatch || modelMatch) && factionMatch && classMatch
    })

    setFilteredShips(filtered)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("starship-favorites")
    if (savedFavorites) {
      try {
        setFavoriteShips(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Failed to parse favorites", e)
      }
    }
  }, [searchTerm, selectedFaction, selectedClass])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedFaction("")
    setSelectedClass("")
  }

  const addToComparison = (ship: Starship) => {
    if (comparisonShips.length >= 3) {
      alert("You can compare up to 3 ships at once. Remove a ship before adding another.")
      return
    }

    if (!comparisonShips.find((s) => s.id === ship.id)) {
      const newComparisonShips = [...comparisonShips, ship]
      setComparisonShips(newComparisonShips)

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

  const toggleFavorite = (ship: Starship) => {
    let newFavorites: string[]

    if (favoriteShips.includes(ship.id)) {
      newFavorites = favoriteShips.filter((id) => id !== ship.id)
    } else {
      newFavorites = [...favoriteShips, ship.id]
    }

    setFavoriteShips(newFavorites)
    localStorage.setItem("starship-favorites", JSON.stringify(newFavorites))
  }

  const themeClasses = {
    background: activeTheme === "empire" ? "bg-gray-950" : "bg-blue-950",
    backgroundLight: activeTheme === "empire" ? "bg-gray-900" : "bg-blue-900",
    accent: activeTheme === "empire" ? "text-red-500" : "text-orange-500",
    accentBg: activeTheme === "empire" ? "bg-red-500" : "bg-orange-500",
    accentBgHover: activeTheme === "empire" ? "hover:bg-red-600" : "hover:bg-orange-600",
    secondary: activeTheme === "empire" ? "text-red-300" : "text-blue-400",
    secondaryBg: activeTheme === "empire" ? "bg-red-300" : "bg-blue-400",
  }

  return (
    <main className={`min-h-screen ${themeClasses.background}`}>
      <LcarsHeader theme={activeTheme} />
      <ThemeSwitcher activeTheme={activeTheme} setActiveTheme={setTheme} />

      <div className="container mx-auto py-20 px-4">
        {/* Search and filters */}
        <div className={`mb-6 p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-90`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="search"
                placeholder="Search starships..."
                className={`w-full bg-black bg-opacity-60 text-gray-200 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 ${activeTheme === "empire" ? "focus:ring-red-500" : "focus:ring-orange-500"} placeholder-gray-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`${themeClasses.accentBg} ${themeClasses.accentBgHover} text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200`}
            >
              <Filter className="h-5 w-5" />
              <span className="font-sci-fi">Filters</span>
              {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {(searchTerm || selectedFaction || selectedClass) && (
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
          <div className={`mt-3 text-gray-200 font-sci-fi text-sm`}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
                  <div className="space-y-2">
                    <label className={`block text-sm font-sci-fi ${themeClasses.accent}`}>► Affiliation Filter</label>
                    <div className="relative">
                      <select
                        className={`w-full bg-black bg-opacity-60 text-gray-200 px-4 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 ${activeTheme === "empire" ? "focus:ring-red-500" : "focus:ring-orange-500"}`}
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
                        className={`w-full bg-black bg-opacity-60 text-gray-200 px-4 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 ${activeTheme === "empire" ? "focus:ring-red-500" : "focus:ring-orange-500"}`}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View selector tabs */}
        <div className="flex mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveView("detail")}
            className={`px-6 py-3 font-sci-fi uppercase text-sm transition-colors duration-200 ${
              activeView === "detail"
                ? `${themeClasses.accentBg} text-white font-bold`
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Ship Details
          </button>

          <div className="w-2"></div>

          <button
            onClick={() => setActiveView("compare")}
            className={`px-6 py-3 font-sci-fi uppercase text-sm transition-colors duration-200 flex items-center ${
              activeView === "compare"
                ? `${themeClasses.accentBg} text-white font-bold`
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare ({comparisonShips.length})
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-90`}>
              <h2 className={`text-xl font-sci-fi mb-4 ${themeClasses.accent}`}>Starship Registry</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredShips.map((ship) => (
                  <button
                    key={ship.id}
                    onClick={() => setSelectedShip(ship)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedShip?.id === ship.id
                        ? activeTheme === "empire"
                          ? "bg-red-900 bg-opacity-30 border-l-4 border-red-500"
                          : "bg-blue-800 bg-opacity-30 border-l-4 border-orange-500"
                        : activeTheme === "empire"
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-blue-800 hover:bg-blue-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{ship.name}</div>
                      <div className="flex space-x-1">
                        {favoriteShips.includes(ship.id) && <Star className={`h-4 w-4 ${themeClasses.accent}`} />}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 flex justify-between">
                      <span>{ship.class}</span>
                      <span className="text-xs">{ship.faction}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison ships */}
            {comparisonShips.length > 0 && (
              <div className={`mt-6 p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-90`}>
                <h2 className={`text-xl font-sci-fi mb-4 ${themeClasses.accent}`}>Comparison Queue</h2>
                <div className="space-y-2">
                  {comparisonShips.map((ship) => (
                    <div
                      key={ship.id}
                      className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded-lg"
                    >
                      <span className="text-gray-200">{ship.name}</span>
                      <button
                        onClick={() => removeFromComparison(ship.id)}
                        className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {comparisonShips.length >= 2 && (
                  <button
                    onClick={() => setActiveView("compare")}
                    className={`mt-4 w-full py-2 ${themeClasses.accentBg} ${themeClasses.accentBgHover} text-white rounded-md font-sci-fi`}
                  >
                    COMPARE SHIPS
                  </button>
                )}
              </div>
            )}

            {/* Favorites section */}
            {favoriteShips.length > 0 && (
              <div className={`mt-6 p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-90`}>
                <h2 className={`text-xl font-sci-fi mb-4 ${themeClasses.accent}`}>Favorite Ships</h2>
                <div className="space-y-2">
                  {starshipData
                    .filter((ship) => favoriteShips.includes(ship.id))
                    .map((ship) => (
                      <button
                        key={ship.id}
                        onClick={() => setSelectedShip(ship)}
                        className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ${
                          activeTheme === "empire" ? "bg-gray-800 hover:bg-gray-700" : "bg-blue-800 hover:bg-blue-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 ${themeClasses.accent} mr-2`} />
                          <span className="text-gray-200">{ship.name}</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeView === "detail" && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShipInformationDisplay
                    ship={selectedShip}
                    theme={activeTheme}
                    onAddToComparison={addToComparison}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favoriteShips.includes(selectedShip?.id || "")}
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
                >
                  <ShipComparisonView ships={comparisonShips} theme={activeTheme} onRemoveShip={removeFromComparison} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}

interface ShipComparisonViewProps {
  ships: Starship[]
  theme: "empire" | "rebellion"
  onRemoveShip: (shipId: string) => void
}

function ShipComparisonView({ ships, theme, onRemoveShip }: ShipComparisonViewProps) {
  const themeClasses = {
    background: theme === "empire" ? "bg-gray-900" : "bg-blue-950",
    backgroundLight: theme === "empire" ? "bg-gray-800" : "bg-blue-900",
    accent: theme === "empire" ? "text-red-500" : "text-orange-500",
    accentBg: theme === "empire" ? "bg-red-500" : "bg-orange-500",
    border: theme === "empire" ? "border-red-900" : "border-orange-900",
    text: theme === "empire" ? "text-gray-200" : "text-gray-200",
    textMuted: theme === "empire" ? "text-gray-400" : "text-gray-400",
  }

  if (ships.length < 2) {
    return (
      <div className={`p-6 rounded-lg ${themeClasses.background} bg-opacity-90 border ${themeClasses.border}`}>
        <div className="text-center py-12">
          <BarChart3 className={`h-16 w-16 ${themeClasses.accent} mx-auto mb-4 opacity-50`} />
          <h3 className={`text-xl font-sci-fi ${themeClasses.accent} mb-2`}>Comparison Mode</h3>
          <p className={`${themeClasses.textMuted} mb-6`}>Add at least 2 ships to compare their specifications</p>
          <p className={`${themeClasses.text}`}>
            Currently selected: <span className={themeClasses.accent}>{ships.length}</span> ship(s)
          </p>
        </div>
      </div>
    )
  }

  // Get all specs keys from all ships
  const allSpecsKeys = ships.reduce((keys, ship) => {
    if (ship.specs) {
      Object.keys(ship.specs).forEach((key) => {
        if (!keys.includes(key)) {
          keys.push(key)
        }
      })
    }
    return keys
  }, [] as string[])

  // Sort keys in a logical order
  const orderedKeys = [
    "length",
    "width",
    "height",
    "max_speed_atmos",
    "hyperdrive",
    "backup_hyperdrive",
    "crew",
    "passengers",
    "cargo_capacity",
    "consumables",
    "armament",
    "shielding",
    "complement",
    ...allSpecsKeys.filter(
      (key) =>
        ![
          "length",
          "width",
          "height",
          "max_speed_atmos",
          "hyperdrive",
          "backup_hyperdrive",
          "crew",
          "passengers",
          "cargo_capacity",
          "consumables",
          "armament",
          "shielding",
          "complement",
        ].includes(key),
    ),
  ]

  // Format spec key for display
  const formatSpecKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Determine if a value is better (for simple numeric comparisons)
  const isBetter = (value: string, otherValues: string[], key: string): boolean => {
    // For these specs, lower is better
    const lowerIsBetter = ["hyperdrive", "backup_hyperdrive"]

    if (!value || otherValues.some((v) => !v)) return false

    // Try to parse as numbers for comparison
    try {
      const numValue = Number.parseFloat(value.replace(/,/g, ""))
      const numOtherValues = otherValues.map((v) => Number.parseFloat(v.replace(/,/g, "")))

      if (isNaN(numValue) || numOtherValues.some(isNaN)) return false

      if (lowerIsBetter.includes(key)) {
        return numOtherValues.every((v) => numValue < v)
      } else {
        return numOtherValues.every((v) => numValue > v)
      }
    } catch {
      return false
    }
  }

  return (
    <div
      className={`rounded-lg overflow-hidden ${themeClasses.background} bg-opacity-90 border ${themeClasses.border}`}
    >
      <div className={`p-6 ${theme === "empire" ? "bg-gray-950" : "bg-blue-950"} bg-opacity-70`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-sci-fi ${themeClasses.accent}`}>Ship Comparison</h2>
        </div>
      </div>

      {/* Ship cards */}
      <div className="flex flex-wrap gap-4 p-6">
        {ships.map((ship) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative ${themeClasses.backgroundLight} border ${themeClasses.border} rounded-lg p-4 flex-grow min-w-[250px] max-w-[300px]`}
          >
            <button
              onClick={() => onRemoveShip(ship.id)}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
              aria-label="Remove from comparison"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className={`${themeClasses.accent} font-sci-fi text-lg mb-2`}>{ship.name}</h3>
            <div className={`text-xs ${themeClasses.textMuted} mb-3`}>
              {ship.manufacturer} • {ship.class}
            </div>

            <div
              className={`w-full h-1 ${themeClasses.accentBg} mb-3 relative overflow-hidden`}
              style={{ opacity: 0.7 }}
            >
              <div className="absolute inset-0 tech-line-animation"></div>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className={themeClasses.textMuted}>Faction:</span>
              <span className={themeClasses.text}>{ship.faction}</span>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className={themeClasses.textMuted}>Length:</span>
              <span className={themeClasses.text}>{ship.specs?.length || "Unknown"}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className={themeClasses.textMuted}>Hyperdrive:</span>
              <span className={themeClasses.text}>{ship.specs?.hyperdrive || "Unknown"}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={`text-left py-3 px-4 ${themeClasses.accent} font-sci-fi`}>Specification</th>
                {ships.map((ship) => (
                  <th key={ship.id} className={`text-left py-3 px-4 ${themeClasses.accent} font-sci-fi`}>
                    {ship.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedKeys.map((key) => {
                // Skip if no ship has this spec
                if (!ships.some((ship) => ship.specs?.[key])) return null

                return (
                  <tr key={key} className="border-b border-gray-800 hover:bg-black hover:bg-opacity-30">
                    <td className={`py-3 px-4 ${themeClasses.textMuted} font-sci-fi`}>{formatSpecKey(key)}</td>
                    {ships.map((ship) => {
                      const value = ship.specs?.[key] || "—"
                      const otherValues = ships.filter((s) => s.id !== ship.id).map((s) => s.specs?.[key] || "")
                      const better = isBetter(value, otherValues, key)

                      return (
                        <td
                          key={`${ship.id}-${key}`}
                          className={`py-3 px-4 ${better ? (theme === "empire" ? "text-yellow-400" : "text-blue-300") : themeClasses.text}`}
                        >
                          {value}
                          {better && <span className="ml-1">▲</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual comparison */}
      <div className="p-6 border-t border-gray-800">
        <h3 className={`${themeClasses.accent} font-sci-fi mb-4`}>Visual Comparison</h3>
        <div className="h-40 bg-black bg-opacity-50 rounded-lg relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700"></div>
          {ships.map((ship, index) => {
            // Calculate relative size based on length
            const length = Number.parseFloat(String(ship.specs?.length || "0").replace(/,/g, ""))
            const maxLength = Math.max(
              ...ships.map((s) => Number.parseFloat(String(s.specs?.length || "0").replace(/,/g, ""))),
            )
            const relativeHeight = maxLength > 0 ? (length / maxLength) * 80 : 10 // 80% of container max

            return (
              <div
                key={ship.id}
                className="absolute bottom-1"
                style={{
                  left: `${(100 / (ships.length + 1)) * (index + 1)}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className={`w-10 ${themeClasses.accentBg} opacity-70`}
                  style={{ height: `${relativeHeight}%` }}
                ></div>
                <div className={`text-xs ${themeClasses.textMuted} mt-1 text-center`}>{ship.name}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
