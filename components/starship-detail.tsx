"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Starship } from "@/types/starship"
import {
  Shield,
  Zap,
  Users,
  Package,
  Crosshair,
  Info,
  Maximize2,
  Minimize2,
  BookmarkPlus,
  BarChart3,
  Share2,
  Download,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface StarshipDetailProps {
  ship: Starship | null
  theme: "empire" | "rebellion"
  onAddToComparison: (ship: Starship) => void
  onToggleBookmark: (ship: Starship) => void
  isBookmarked: boolean
  onSelectShip: (ship: Starship) => void
}

export default function StarshipDetail({
  ship,
  theme,
  onAddToComparison,
  onToggleBookmark,
  isBookmarked,
  onSelectShip,
}: StarshipDetailProps) {
  const [factionClass, setFactionClass] = useState("")
  const [activeTab, setActiveTab] = useState("specs")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [relatedShips, setRelatedShips] = useState<Starship[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (ship) {
      // Set faction class for styling
      const faction = ship.faction.toLowerCase()
      if (faction.includes("empire")) {
        setFactionClass("faction-empire")
      } else if (faction.includes("rebellion") || faction.includes("republic")) {
        setFactionClass("faction-rebellion")
      } else if (faction.includes("separatist")) {
        setFactionClass("faction-separatist")
      } else {
        setFactionClass("faction-neutral")
      }

      // Find related ships (same faction or class)
      import("@/data/starships").then(({ starshipData }) => {
        const related = starshipData
          .filter((s) => s.id !== ship.id && (s.faction === ship.faction || s.class === ship.class))
          .slice(0, 3)
        setRelatedShips(related)
      })
    }
  }, [ship])

  const handleShare = () => {
    if (!ship) return

    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`Check out the ${ship.name} in the Galactic Archives!`)
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard.",
    })
  }

  const handleDownload = () => {
    if (!ship) return

    // In a real app, this would generate a PDF or data file
    toast({
      title: "Download Started",
      description: `Technical specifications for ${ship.name} are being prepared for download.`,
    })
  }

  const themeClasses = {
    panelBg: theme === "empire" ? "bg-empire-panel" : "bg-rebellion-panel",
    panelDarkBg: theme === "empire" ? "bg-empire-panel-dark" : "bg-rebellion-panel-dark",
    panelLightBg: theme === "empire" ? "bg-empire-panel-light" : "bg-rebellion-panel-light",
    accent: theme === "empire" ? "text-empire-accent" : "text-rebellion-accent",
    accentBg: theme === "empire" ? "bg-empire-accent" : "bg-rebellion-accent",
    accentSecondary: theme === "empire" ? "text-red-500" : "text-yellow-400",
    accentSecondaryBg: theme === "empire" ? "bg-red-500" : "bg-yellow-400",
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

  if (!ship) {
    return (
      <div className={`flex-grow flex items-center justify-center p-6 ${themeClasses.panelBg}`}>
        <div className="text-center space-y-4 max-w-md">
          <div className={`${themeClasses.accent} font-sci-fi text-2xl animate-pulse`}>[ No Target Selected ]</div>
          <div className={`${themeClasses.textMuted} uppercase tracking-wider text-sm`}>
            Select a starship designation from the registry
          </div>
          <div className="mt-8 flex justify-center">
            <div
              className={`w-32 h-32 border-4 ${themeClasses.border} rounded-full flex items-center justify-center relative`}
            >
              <div
                className={`w-24 h-24 border ${themeClasses.border} rounded-full animate-ping absolute opacity-30`}
              ></div>
              <div className={`w-16 h-16 ${themeClasses.accentBg} rounded-full animate-pulse opacity-20`}></div>
              <div className={`w-4 h-4 ${themeClasses.accentBg} rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex-grow overflow-y-auto ${themeClasses.panelBg} custom-scrollbar ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={ship.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-full"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className={`h-5 w-5 ${themeClasses.accent}`} />
            ) : (
              <Maximize2 className={`h-5 w-5 ${themeClasses.accent}`} />
            )}
          </button>

          {/* LCARS-inspired header */}
          <div className="flex items-stretch mb-6">
            <div className={`${themeClasses.accentBg} w-10 h-10 rounded-br-full flex-shrink-0`}></div>
            <div className="flex-grow">
              <div className="flex items-center">
                <h2 className={`text-2xl md:text-3xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase ml-4`}>
                  {ship.name}
                </h2>
                <div className="ml-auto flex space-x-2">
                  <button
                    onClick={() => onAddToComparison(ship)}
                    className={`p-2 rounded ${themeClasses.panelDarkBg} hover:${themeClasses.accentBg} transition-colors duration-200 flex items-center`}
                    title="Add to comparison"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span className="text-xs font-sci-fi hidden md:inline">Compare</span>
                  </button>

                  <button
                    onClick={() => onToggleBookmark(ship)}
                    className={`p-2 rounded ${
                      isBookmarked ? themeClasses.accentBg : themeClasses.panelDarkBg
                    } hover:${themeClasses.accentBg} transition-colors duration-200 flex items-center`}
                    title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    <span className="text-xs font-sci-fi hidden md:inline">
                      {isBookmarked ? "Bookmarked" : "Bookmark"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className={`p-2 rounded ${themeClasses.panelDarkBg} hover:${themeClasses.accentBg} transition-colors duration-200 flex items-center`}
                    title="Share"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="text-xs font-sci-fi hidden md:inline">Share</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className={`p-2 rounded ${themeClasses.panelDarkBg} hover:${themeClasses.accentBg} transition-colors duration-200 flex items-center`}
                    title="Download specs"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span className="text-xs font-sci-fi hidden md:inline">Download</span>
                  </button>
                </div>
              </div>
              <div className={`h-1 w-full ${themeClasses.accentBg} mt-2 relative overflow-hidden`}>
                <div className="absolute inset-0 tech-line-animation"></div>
              </div>
            </div>
          </div>

          {/* Ship image with tech overlay */}
          <div className="mb-6 relative">
            <div
              className={`bg-black bg-opacity-70 border ${themeClasses.border} rounded-lg p-3 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-opacity-70 border-white"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-opacity-70 border-white"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-opacity-70 border-white"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-opacity-70 border-white"></div>

              {/* Tech overlay elements */}
              <div className="absolute top-3 left-10 flex items-center">
                <div className={`h-1 w-20 ${themeClasses.accentBg} mr-2`}></div>
                <div className={`text-xs ${themeClasses.accent} font-sci-fi`}>VISUAL FEED</div>
              </div>

              <div className="absolute top-3 right-10 flex items-center">
                <div className={`text-xs ${themeClasses.textMuted} font-sci-fi`}>ID: {ship.id.toUpperCase()}</div>
                <div className={`h-1 w-10 ${themeClasses.accentBg} ml-2`}></div>
              </div>

              <Image
                src={`/placeholder.svg?height=400&width=800`}
                alt={`${ship.name} visual feed`}
                width={800}
                height={400}
                className="w-full h-auto rounded mt-6 mb-2"
              />

              {/* Targeting brackets that animate on hover */}
              <div className="absolute inset-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white"></div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className={`px-3 py-1 bg-black bg-opacity-70 rounded-full text-xs ${themeClasses.textMuted}`}>
                  {ship.manufacturer} • {ship.class} • {ship.faction}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - LCARS inspired */}
          <div className="flex mb-6 overflow-x-auto custom-scrollbar-horizontal">
            <div className={`${themeClasses.accentBg} w-8 h-10 rounded-r-full flex-shrink-0`}></div>

            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-2 font-sci-fi uppercase text-sm transition-colors duration-200 flex-shrink-0 ${
                activeTab === "specs"
                  ? `${themeClasses.accentSecondaryBg} text-black font-bold`
                  : `${themeClasses.panelDarkBg} ${themeClasses.text} hover:bg-opacity-80`
              }`}
            >
              Specifications
            </button>

            <div className="w-2 flex-shrink-0"></div>

            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2 font-sci-fi uppercase text-sm transition-colors duration-200 flex-shrink-0 ${
                activeTab === "profile"
                  ? `${themeClasses.accentSecondaryBg} text-black font-bold`
                  : `${themeClasses.panelDarkBg} ${themeClasses.text} hover:bg-opacity-80`
              }`}
            >
              Profile & Role
            </button>

            <div className="w-2 flex-shrink-0"></div>

            <button
              onClick={() => setActiveTab("tactical")}
              className={`px-6 py-2 font-sci-fi uppercase text-sm transition-colors duration-200 flex-shrink-0 ${
                activeTab === "tactical"
                  ? `${themeClasses.accentSecondaryBg} text-black font-bold`
                  : `${themeClasses.panelDarkBg} ${themeClasses.text} hover:bg-opacity-80`
              }`}
            >
              Tactical Analysis
            </button>

            <div className="w-2 flex-shrink-0"></div>

            <button
              onClick={() => setActiveTab("related")}
              className={`px-6 py-2 font-sci-fi uppercase text-sm transition-colors duration-200 flex-shrink-0 ${
                activeTab === "related"
                  ? `${themeClasses.accentSecondaryBg} text-black font-bold`
                  : `${themeClasses.panelDarkBg} ${themeClasses.text} hover:bg-opacity-80`
              }`}
            >
              Related Ships
            </button>

            <div className="flex-grow"></div>

            <div className={`${theme === "empire" ? "bg-red-700" : "bg-orange-500"} w-6 h-10 flex-shrink-0`}></div>
            <div className={`${themeClasses.accentBg} w-4 h-10 flex-shrink-0`}></div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      <SpecItem label="Class" value={ship.class} icon={<Shield className="h-4 w-4" />} theme={theme} />
                      <SpecItem label="Manufacturer" value={ship.manufacturer} theme={theme} />
                      <SpecItem label="Faction" value={ship.faction} theme={theme} />
                      <SpecItem label="Length" value={ship.specs?.length} theme={theme} />
                      <SpecItem label="Max Speed" value={ship.specs?.max_speed_atmos} theme={theme} />
                      <SpecItem
                        label="Hyperdrive"
                        value={ship.specs?.hyperdrive}
                        icon={<Zap className="h-4 w-4" />}
                        theme={theme}
                        highlight={ship.specs?.hyperdrive?.includes("0.5")}
                      />
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <SpecItem
                        label="Shielding"
                        value={ship.specs?.shielding}
                        icon={<Shield className="h-4 w-4" />}
                        theme={theme}
                      />
                      <SpecItem
                        label="Armament"
                        value={ship.specs?.armament}
                        icon={<Crosshair className="h-4 w-4" />}
                        theme={theme}
                        highlight={ship.specs?.armament?.includes("Turbolasers")}
                      />
                      <SpecItem
                        label="Crew"
                        value={ship.specs?.crew}
                        icon={<Users className="h-4 w-4" />}
                        theme={theme}
                      />
                      <SpecItem label="Passengers" value={ship.specs?.passengers} theme={theme} />
                      <SpecItem
                        label="Cargo Capacity"
                        value={ship.specs?.cargo_capacity}
                        icon={<Package className="h-4 w-4" />}
                        theme={theme}
                      />
                      <SpecItem label="Complement" value={ship.specs?.complement} theme={theme} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden p-6`}
                >
                  <div className="flex">
                    <div className={`w-1 ${themeClasses.accentBg} self-stretch mr-4 rounded-full`}></div>
                    <div>
                      <h3 className={`${themeClasses.accent} font-sci-fi text-lg mb-4`}>Profile & Historical Data</h3>
                      <div className={`${themeClasses.text} leading-relaxed space-y-4`}>
                        <p>{ship.description || "No profile data available in archives."}</p>

                        {/* Additional lore details - could be expanded */}
                        <div className={`mt-6 p-4 border ${themeClasses.border} bg-black bg-opacity-30 rounded`}>
                          <div className="flex items-center mb-2">
                            <Info className={`h-5 w-5 mr-2 ${themeClasses.accent}`} />
                            <h4 className={`${themeClasses.accent} font-sci-fi`}>Notable Deployments</h4>
                          </div>
                          <p className={`${themeClasses.textMuted} text-sm`}>
                            {ship.id === "millennium-falcon" && "Kessel Run, Battle of Yavin, Battle of Endor"}
                            {ship.id === "x-wing" && "Battle of Yavin, Battle of Hoth, Battle of Endor"}
                            {ship.id === "tie-fighter" && "Battle of Yavin, Battle of Hoth, Battle of Endor"}
                            {ship.id === "star-destroyer" && "Blockade of Tatooine, Battle of Hoth, Battle of Endor"}
                            {!["millennium-falcon", "x-wing", "tie-fighter", "star-destroyer"].includes(ship.id) &&
                              "Data classified or unavailable"}
                          </p>
                        </div>

                        {/* Historical timeline */}
                        <div className="mt-6">
                          <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Historical Timeline</h4>
                          <div className="relative">
                            <div
                              className={`absolute left-4 top-0 bottom-0 w-0.5 ${themeClasses.accentBg} opacity-50`}
                            ></div>

                            <div className="ml-10 relative mb-6">
                              <div
                                className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}
                              ></div>
                              <div className={`${themeClasses.text} font-bold`}>First Commissioned</div>
                              <div className={`${themeClasses.textMuted} text-sm`}>
                                {ship.id === "millennium-falcon" && "Circa 60 BBY (Before Battle of Yavin)"}
                                {ship.id === "x-wing" && "Circa 1 BBY"}
                                {ship.id === "tie-fighter" && "Circa 19 BBY"}
                                {ship.id === "star-destroyer" && "Circa 19 BBY"}
                                {!["millennium-falcon", "x-wing", "tie-fighter", "star-destroyer"].includes(ship.id) &&
                                  "Date unknown"}
                              </div>
                            </div>

                            <div className="ml-10 relative mb-6">
                              <div
                                className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}
                              ></div>
                              <div className={`${themeClasses.text} font-bold`}>Notable Service</div>
                              <div className={`${themeClasses.textMuted} text-sm`}>
                                {ship.id === "millennium-falcon" && "Galactic Civil War (0-4 ABY)"}
                                {ship.id === "x-wing" && "Galactic Civil War (0-4 ABY)"}
                                {ship.id === "tie-fighter" && "Imperial Era (19 BBY - 4 ABY)"}
                                {ship.id === "star-destroyer" && "Imperial Era (19 BBY - 4 ABY)"}
                                {!["millennium-falcon", "x-wing", "tie-fighter", "star-destroyer"].includes(ship.id) &&
                                  "Records incomplete"}
                              </div>
                            </div>

                            <div className="ml-10 relative">
                              <div
                                className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}
                              ></div>
                              <div className={`${themeClasses.text} font-bold`}>Current Status</div>
                              <div className={`${themeClasses.textMuted} text-sm`}>
                                {ship.id === "millennium-falcon" && "Active - New Republic Registry"}
                                {ship.id === "x-wing" && "Active - New Republic Fleet"}
                                {ship.id === "tie-fighter" && "Limited Service - Imperial Remnant"}
                                {ship.id === "star-destroyer" && "Limited Service - Imperial Remnant"}
                                {!["millennium-falcon", "x-wing", "tie-fighter", "star-destroyer"].includes(ship.id) &&
                                  "Status unknown"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tactical" && (
              <motion.div
                key="tactical"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden p-6`}
                >
                  <div className="text-center mb-6">
                    <h3 className={`${themeClasses.accent} font-sci-fi text-lg`}>Tactical Analysis</h3>
                    <div className={`h-1 w-40 mx-auto ${themeClasses.accentBg} mt-2`}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Firepower */}
                    <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                      <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-2`}>Firepower</h4>
                      <div className="flex justify-center mb-2">
                        <div className="w-full max-w-[150px] h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                            style={{
                              width: `${
                                ship.id === "star-destroyer"
                                  ? "95%"
                                  : ship.id === "mon-cal-cruiser"
                                    ? "85%"
                                    : ship.id === "millennium-falcon"
                                      ? "65%"
                                      : ship.id === "x-wing"
                                        ? "45%"
                                        : ship.id === "tie-fighter"
                                          ? "30%"
                                          : "50%"
                              }`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className={`${themeClasses.textMuted} text-sm text-center`}>
                        {ship.id === "star-destroyer"
                          ? "Extreme"
                          : ship.id === "mon-cal-cruiser"
                            ? "Very High"
                            : ship.id === "millennium-falcon"
                              ? "Moderate"
                              : ship.id === "x-wing"
                                ? "Light"
                                : ship.id === "tie-fighter"
                                  ? "Minimal"
                                  : "Unknown"}
                      </p>
                    </div>

                    {/* Durability */}
                    <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                      <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-2`}>Durability</h4>
                      <div className="flex justify-center mb-2">
                        <div className="w-full max-w-[150px] h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                            style={{
                              width: `${
                                ship.id === "star-destroyer"
                                  ? "90%"
                                  : ship.id === "mon-cal-cruiser"
                                    ? "95%"
                                    : ship.id === "millennium-falcon"
                                      ? "70%"
                                      : ship.id === "x-wing"
                                        ? "50%"
                                        : ship.id === "tie-fighter"
                                          ? "20%"
                                          : "60%"
                              }`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className={`${themeClasses.textMuted} text-sm text-center`}>
                        {ship.id === "star-destroyer"
                          ? "Very High"
                          : ship.id === "mon-cal-cruiser"
                            ? "Extreme"
                            : ship.id === "millennium-falcon"
                              ? "High"
                              : ship.id === "x-wing"
                                ? "Moderate"
                                : ship.id === "tie-fighter"
                                  ? "Low"
                                  : "Unknown"}
                      </p>
                    </div>

                    {/* Speed */}
                    <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                      <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-2`}>Speed</h4>
                      <div className="flex justify-center mb-2">
                        <div className="w-full max-w-[150px] h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                            style={{
                              width: `${
                                ship.id === "star-destroyer"
                                  ? "30%"
                                  : ship.id === "mon-cal-cruiser"
                                    ? "35%"
                                    : ship.id === "millennium-falcon"
                                      ? "95%"
                                      : ship.id === "x-wing"
                                        ? "75%"
                                        : ship.id === "tie-fighter"
                                          ? "85%"
                                          : "50%"
                              }`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className={`${themeClasses.textMuted} text-sm text-center`}>
                        {ship.id === "star-destroyer"
                          ? "Low"
                          : ship.id === "mon-cal-cruiser"
                            ? "Low"
                            : ship.id === "millennium-falcon"
                              ? "Extreme"
                              : ship.id === "x-wing"
                                ? "High"
                                : ship.id === "tie-fighter"
                                  ? "Very High"
                                  : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Tactical Assessment</h4>
                    <p className={`${themeClasses.text} text-sm`}>
                      {ship.id === "millennium-falcon" &&
                        "Despite its appearance, the Millennium Falcon is one of the most formidable light freighters in the galaxy. Its modified shields and weapons make it comparable to light military craft, while its exceptional speed and maneuverability for its size class make it difficult to track and target. The ship's numerous modifications and hidden compartments provide tactical advantages in both combat and stealth operations."}
                      {ship.id === "x-wing" &&
                        "The X-wing represents an excellent balance of firepower, durability, and speed. Its proton torpedoes give it capability against capital ships, while its four laser cannons are effective against fighters. The astromech droid allows for hyperspace travel without a navigation computer and can perform repairs during combat. The S-foils provide superior heat dissipation during combat operations."}
                      {ship.id === "tie-fighter" &&
                        "TIE Fighters rely on numerical superiority and pilot skill rather than individual craft capabilities. The lack of shields and hyperdrive makes them vulnerable but reduces mass significantly, resulting in exceptional maneuverability. Standard Imperial doctrine deploys them in overwhelming numbers to compensate for individual vulnerability."}
                      {ship.id === "star-destroyer" &&
                        "The Imperial Star Destroyer is designed as a symbol of Imperial power projection as much as a military asset. Its massive forward-facing weapons array creates an overwhelming frontal assault capability, though this creates a vulnerability in its rear quadrant. The ship serves effectively as both a carrier for TIE squadrons and as a planetary siege platform."}
                      {ship.id === "mon-cal-cruiser" &&
                        "Mon Calamari cruisers feature exceptional shield systems with multiple redundancies, making them more durable than Imperial vessels of similar size. Their unique designs distribute weapon systems more evenly than Imperial vessels, allowing for better coverage but slightly reduced forward firepower compared to Imperial Star Destroyers."}
                      {!["millennium-falcon", "x-wing", "tie-fighter", "star-destroyer", "mon-cal-cruiser"].includes(
                        ship.id,
                      ) &&
                        "Tactical assessment data is classified or unavailable for this vessel. Access requires higher security clearance."}
                    </p>
                  </div>

                  {/* Tactical diagram */}
                  <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-black bg-opacity-40">
                    <h4 className={`${themeClasses.accent} font-sci-fi mb-3 text-center`}>Tactical Diagram</h4>
                    <div className="aspect-video bg-black bg-opacity-70 rounded relative overflow-hidden">
                      {/* This would be a tactical diagram in a real app */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-sm ${themeClasses.textMuted}`}>
                          [Tactical diagram unavailable - Clearance level insufficient]
                        </div>
                      </div>

                      {/* Grid lines */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${theme === "empire" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 100, 255, 0.2)"} 1px, transparent 1px), 
                                          linear-gradient(to bottom, ${theme === "empire" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 100, 255, 0.2)"} 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>

                      {/* Scanning line animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className={`h-1 w-full ${themeClasses.accentBg} opacity-50 animate-scan`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "related" && (
              <motion.div
                key="related"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden p-6`}
                >
                  <h3 className={`${themeClasses.accent} font-sci-fi text-lg mb-4`}>Related Vessels</h3>

                  {relatedShips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedShips.map((relatedShip) => (
                        <div
                          key={relatedShip.id}
                          className={`border ${themeClasses.border} bg-black bg-opacity-30 rounded-lg overflow-hidden cursor-pointer hover:border-opacity-100 transition-all duration-200`}
                        >
                          <div className={`${themeClasses.accentBg} h-1 w-full`}></div>
                          <div className="p-4">
                            <h4 className={`${themeClasses.text} font-sci-fi mb-2`}>{relatedShip.name}</h4>
                            <div className="flex items-center text-xs mb-2">
                              <Shield className={`h-3 w-3 mr-1 ${themeClasses.accent}`} />
                              <span className={themeClasses.textMuted}>{relatedShip.class}</span>
                            </div>
                            <div className={`text-xs ${themeClasses.textMuted} line-clamp-2`}>
                              {relatedShip.description?.substring(0, 100)}...
                            </div>
                            <button
                              className={`mt-3 text-xs ${themeClasses.accent} font-sci-fi hover:underline`}
                              onClick={() => onSelectShip(relatedShip)}
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className={`${themeClasses.textMuted}`}>No related vessels found in database.</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Relationship Analysis</h4>
                    <p className={`${themeClasses.text} text-sm`}>
                      Ships of the same class or faction often share design philosophies, tactical roles, and
                      operational doctrines. The vessels listed above have been identified as related to {ship.name}{" "}
                      based on shared characteristics, historical deployment patterns, or technical specifications.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface SpecItemProps {
  label: string
  value?: string
  icon?: React.ReactNode
  theme: "empire" | "rebellion"
  highlight?: boolean
}

function SpecItem({ label, value, icon, theme, highlight = false }: SpecItemProps) {
  if (!value) return null

  const themeClasses = {
    accent: theme === "empire" ? "text-empire-accent" : "text-rebellion-accent",
    accentSecondary: theme === "empire" ? "text-red-500" : "text-yellow-400",
    text: theme === "empire" ? "text-empire-text" : "text-rebellion-text",
    border: theme === "empire" ? "border-empire-border" : "border-rebellion-border",
  }

  return (
    <div className="flex items-center group">
      <div className={`w-32 text-right text-sm ${themeClasses.accent} font-sci-fi uppercase pr-3`}>{label}:</div>
      <div
        className={`flex-grow border-b border-dotted ${themeClasses.border} pb-1 flex items-center group-hover:border-opacity-100 transition-all duration-200`}
      >
        {icon && <span className="mr-2 text-gray-400">{icon}</span>}
        <span className={`${themeClasses.text} ${highlight ? themeClasses.accentSecondary : ""}`}>{value}</span>
      </div>
    </div>
  )
}
