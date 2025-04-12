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
  Clock,
  Award,
  Lightbulb,
  FileText,
  BarChart3,
  Map,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Star,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface ShipInformationDisplayProps {
  ship: Starship | null
  theme: "empire" | "rebellion"
  onAddToComparison?: (ship: Starship) => void
  onToggleFavorite?: (ship: Starship) => void
  isFavorite?: boolean
}

export default function ShipInformationDisplay({
  ship,
  theme,
  onAddToComparison,
  onToggleFavorite,
  isFavorite = false,
}: ShipInformationDisplayProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "history" | "tactical" | "missions" | "personnel" | "3d">(
    "specs",
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHologram, setShowHologram] = useState(false)
  const { toast } = useToast()

  // Reset tab when ship changes
  useEffect(() => {
    setActiveTab("specs")
  }, [ship?.id])

  if (!ship) {
    return (
      <div className={`p-6 rounded-lg ${theme === "empire" ? "bg-gray-900" : "bg-blue-950"} bg-opacity-30`}>
        <div className="text-center">
          <p className={`text-xl ${theme === "empire" ? "text-red-400" : "text-orange-400"}`}>No ship selected</p>
          <p className="text-gray-400 mt-2">Select a ship from the registry to view detailed information</p>
        </div>
      </div>
    )
  }

  // Check if ship has extended information
  const hasExtendedInfo = ship.description && ship.specs

  // Theme classes
  const themeClasses = {
    background: theme === "empire" ? "bg-gray-900" : "bg-blue-950",
    backgroundLight: theme === "empire" ? "bg-gray-800" : "bg-blue-900",
    backgroundDark: theme === "empire" ? "bg-gray-950" : "bg-blue-950",
    accent: theme === "empire" ? "text-red-500" : "text-orange-500",
    accentBg: theme === "empire" ? "bg-red-500" : "bg-orange-500",
    accentBgHover: theme === "empire" ? "hover:bg-red-600" : "hover:bg-orange-600",
    accentLight: theme === "empire" ? "text-red-400" : "text-orange-400",
    accentDark: theme === "empire" ? "text-red-700" : "text-orange-700",
    border: theme === "empire" ? "border-red-900" : "border-orange-900",
    text: theme === "empire" ? "text-gray-200" : "text-gray-200",
    textMuted: theme === "empire" ? "text-gray-400" : "text-gray-400",
    highlight: theme === "empire" ? "text-yellow-400" : "text-blue-300",
    secondary: theme === "empire" ? "text-red-300" : "text-blue-400",
    secondaryBg: theme === "empire" ? "bg-red-300" : "bg-blue-400",
  }

  // Tab button style
  const tabButtonClass = (isActive: boolean) => `
    px-4 py-2 rounded-t-lg font-sci-fi text-sm uppercase tracking-wider
    ${
      isActive
        ? `${themeClasses.accentBg} text-white`
        : `${themeClasses.backgroundLight} ${themeClasses.text} ${themeClasses.accentBgHover}`
    }
    transition-colors duration-200
  `

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out the ${ship.name} in the Galactic Archives!`)
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard.",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Technical specifications for ${ship.name} are being prepared for download.`,
    })
  }

  return (
    <div
      className={`rounded-lg overflow-hidden ${themeClasses.background} bg-opacity-90 border ${themeClasses.border} ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Ship header */}
      <div className={`p-6 ${themeClasses.backgroundDark} bg-opacity-70`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-sci-fi ${themeClasses.accent}`}>{ship.name}</h2>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full ${themeClasses.backgroundLight} text-sm ${themeClasses.accent}`}>
              {ship.faction}
            </div>

            <div className="flex space-x-1">
              {onAddToComparison && (
                <button
                  onClick={() => onAddToComparison(ship)}
                  className={`p-2 rounded ${themeClasses.backgroundLight} hover:${themeClasses.accentBg} transition-colors duration-200`}
                  title="Add to comparison"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              )}

              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(ship)}
                  className={`p-2 rounded ${isFavorite ? themeClasses.accentBg : themeClasses.backgroundLight} hover:${themeClasses.accentBg} transition-colors duration-200`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded ${themeClasses.backgroundLight} hover:${themeClasses.accentBg} transition-colors duration-200`}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <span className={themeClasses.textMuted}>{ship.manufacturer}</span>
          <span className="mx-2">•</span>
          <span className={themeClasses.text}>{ship.class}</span>
          {ship.model && (
            <>
              <span className="mx-2">•</span>
              <span className={themeClasses.textMuted}>{ship.model}</span>
            </>
          )}
        </div>
      </div>

      {/* Ship image */}
      <div className="relative">
        <div className="relative">
          <Image
            src={`/placeholder.svg?height=300&width=800&text=${encodeURIComponent(ship.name)}`}
            alt={ship.name}
            width={800}
            height={300}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        </div>

        {/* Hologram overlay */}
        {showHologram && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="relative w-full max-w-2xl h-64">
              <div className="absolute inset-0 animate-pulse opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-blue-400 text-center">
                  <p className="text-xl font-sci-fi mb-2">Holographic Projection</p>
                  <p className="text-sm">Rendering {ship.name} model...</p>
                </div>
              </div>
              <button
                onClick={() => setShowHologram(false)}
                className="absolute top-2 right-2 bg-blue-900 text-blue-300 rounded-full p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Technical overlay elements */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className={`h-1 w-16 ${themeClasses.accentBg} mr-2`}></div>
          <div className={`text-xs ${themeClasses.accent} font-sci-fi`}>VISUAL SCAN</div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center">
          <div className={`text-xs ${themeClasses.textMuted} font-sci-fi`}>ID: {ship.id.toUpperCase()}</div>
          <div className={`h-1 w-10 ${themeClasses.accentBg} ml-2`}></div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <button
            onClick={() => setShowHologram(true)}
            className={`px-3 py-1 rounded text-xs ${themeClasses.secondaryBg} text-black font-sci-fi`}
          >
            VIEW HOLOGRAM
          </button>
          <button
            onClick={handleShare}
            className={`px-3 py-1 rounded text-xs bg-gray-800 text-gray-200 font-sci-fi flex items-center`}
          >
            <Share2 className="h-3 w-3 mr-1" /> SHARE
          </button>
          <button
            onClick={handleDownload}
            className={`px-3 py-1 rounded text-xs bg-gray-800 text-gray-200 font-sci-fi flex items-center`}
          >
            <Download className="h-3 w-3 mr-1" /> DOWNLOAD
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex px-6 pt-4 border-b border-gray-800 overflow-x-auto">
        <button className={tabButtonClass(activeTab === "specs")} onClick={() => setActiveTab("specs")}>
          <Shield className="h-4 w-4 inline mr-2" />
          Specifications
        </button>
        <button className={tabButtonClass(activeTab === "history")} onClick={() => setActiveTab("history")}>
          <Clock className="h-4 w-4 inline mr-2" />
          History
        </button>
        <button className={tabButtonClass(activeTab === "tactical")} onClick={() => setActiveTab("tactical")}>
          <Crosshair className="h-4 w-4 inline mr-2" />
          Tactical
        </button>
        <button className={tabButtonClass(activeTab === "missions")} onClick={() => setActiveTab("missions")}>
          <Award className="h-4 w-4 inline mr-2" />
          Missions
        </button>
        <button className={tabButtonClass(activeTab === "personnel")} onClick={() => setActiveTab("personnel")}>
          <Users className="h-4 w-4 inline mr-2" />
          Personnel
        </button>
        <button className={tabButtonClass(activeTab === "3d")} onClick={() => setActiveTab("3d")}>
          <Map className="h-4 w-4 inline mr-2" />
          3D Model
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {activeTab === "specs" && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>Technical Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <SpecItem label="Crew" value={ship.specs?.crew} icon={<Users className="h-4 w-4" />} theme={theme} />
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

              {/* Performance metrics */}
              <div className={`mt-6 p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Speed Rating */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={themeClasses.textMuted}>Speed Rating</span>
                      <span className={themeClasses.secondary}>
                        {ship.class.toLowerCase().includes("fighter") || ship.id === "millennium-falcon"
                          ? "High"
                          : "Medium"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={theme === "empire" ? "bg-red-500" : "bg-blue-500"}
                        style={{
                          width: ship.class.toLowerCase().includes("fighter")
                            ? "85%"
                            : ship.id === "millennium-falcon"
                              ? "95%"
                              : ship.class.toLowerCase().includes("destroyer")
                                ? "40%"
                                : "60%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Maneuverability */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={themeClasses.textMuted}>Maneuverability</span>
                      <span className={themeClasses.secondary}>
                        {ship.class.toLowerCase().includes("fighter")
                          ? "Excellent"
                          : ship.id === "millennium-falcon"
                            ? "Good"
                            : "Limited"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={theme === "empire" ? "bg-red-500" : "bg-blue-500"}
                        style={{
                          width: ship.class.toLowerCase().includes("fighter")
                            ? "90%"
                            : ship.id === "millennium-falcon"
                              ? "75%"
                              : ship.class.toLowerCase().includes("destroyer")
                                ? "30%"
                                : "50%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Firepower */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={themeClasses.textMuted}>Firepower</span>
                      <span className={themeClasses.secondary}>
                        {ship.class.toLowerCase().includes("destroyer")
                          ? "Extreme"
                          : ship.class.toLowerCase().includes("fighter")
                            ? "Light"
                            : "Medium"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={theme === "empire" ? "bg-red-500" : "bg-blue-500"}
                        style={{
                          width: ship.class.toLowerCase().includes("destroyer")
                            ? "95%"
                            : ship.class.toLowerCase().includes("fighter")
                              ? "40%"
                              : ship.id === "millennium-falcon"
                                ? "65%"
                                : "75%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {ship.technicalNotes && (
                <div className={`mt-6 p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3 flex items-center`}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Technical Notes
                  </h4>
                  <ul className="space-y-2">
                    {ship.technicalNotes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`w-1.5 h-1.5 mt-1.5 mr-2 ${themeClasses.accentBg} rounded-full flex-shrink-0`}
                        ></div>
                        <span className={themeClasses.text}>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && ship.description && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>Historical Records</h3>

              <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <p className={`${themeClasses.text} leading-relaxed`}>{ship.lore?.history || ship.description}</p>
              </div>

              {ship.lore?.notableEvents && (
                <div>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Notable Events</h4>
                  <ul className="space-y-2">
                    {ship.lore.notableEvents.map((event, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-lg ${themeClasses.backgroundLight} bg-opacity-30 flex items-start`}
                      >
                        <div
                          className={`w-1.5 h-1.5 mt-1.5 mr-2 ${themeClasses.accentBg} rounded-full flex-shrink-0`}
                        ></div>
                        <span className={themeClasses.text}>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ship.lore?.quotes && (
                <div>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Notable Quotes</h4>
                  <div className="space-y-4">
                    {ship.lore.quotes.map((quote, index) => (
                      <div
                        key={index}
                        className={`p-4 border-l-4 ${themeClasses.border} ${themeClasses.backgroundLight} bg-opacity-30 rounded-r-lg`}
                      >
                        <p className={`${themeClasses.text} italic`}>"{quote.text}"</p>
                        <p className={`${themeClasses.accent} text-sm mt-2`}>— {quote.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Timeline */}
              <div>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Historical Timeline</h4>
                <div className="relative">
                  <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${themeClasses.accentBg} opacity-50`}></div>

                  <div className="ml-10 relative mb-6">
                    <div className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}></div>
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
                    <div className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}></div>
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
                    <div className={`absolute left-[-1.5rem] w-3 h-3 ${themeClasses.accentBg} rounded-full`}></div>
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
          )}

          {activeTab === "tactical" && ship?.lore && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>Tactical Analysis</h3>

              <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-2`}>Assessment</h4>
                <p className={`${themeClasses.text} leading-relaxed`}>{ship.lore.tacticalAssessment}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Strengths</h4>
                  <ul className="space-y-2">
                    {ship.lore.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`w-1.5 h-1.5 mt-1.5 mr-2 ${themeClasses.accentBg} rounded-full flex-shrink-0`}
                        ></div>
                        <span className={themeClasses.text}>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Weaknesses</h4>
                  <ul className="space-y-2">
                    {ship.lore.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`w-1.5 h-1.5 mt-1.5 mr-2 ${themeClasses.accentBg} rounded-full flex-shrink-0`}
                        ></div>
                        <span className={themeClasses.text}>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-2`}>Fleet Role</h4>
                <p className={`${themeClasses.text} leading-relaxed`}>{ship.lore.fleetRole}</p>
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

              {/* Combat effectiveness */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Firepower */}
                <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                  <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-2`}>Firepower</h4>
                  <div className="flex justify-center mb-2">
                    <div className="w-full max-w-[150px] h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-orange-500"}`}
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
                        className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-orange-500"}`}
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
                        className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-orange-500"}`}
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
            </div>
          )}

          {activeTab === "missions" && ship?.missions && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>Mission Records</h3>

              <div className="space-y-4">
                {ship.missions.notable.map((mission, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50 border-l-4 ${
                      mission.status === "Completed"
                        ? "border-green-500"
                        : mission.status === "Failed"
                          ? "border-red-500"
                          : mission.status === "Ongoing"
                            ? "border-blue-500"
                            : "border-yellow-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`${themeClasses.accent} font-sci-fi`}>{mission.name}</h4>
                      <div
                        className={`px-2 py-1 rounded text-xs ${
                          mission.status === "Completed"
                            ? "bg-green-900 text-green-300"
                            : mission.status === "Failed"
                              ? "bg-red-900 text-red-300"
                              : mission.status === "Ongoing"
                                ? "bg-blue-900 text-blue-300"
                                : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {mission.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className={`${themeClasses.textMuted}`}>Code:</span>
                        <span className={`${themeClasses.text} ml-2`}>{mission.code}</span>
                      </div>
                      <div>
                        <span className={`${themeClasses.textMuted}`}>Date:</span>
                        <span className={`${themeClasses.text} ml-2`}>{mission.date}</span>
                      </div>
                    </div>

                    <p className={`${themeClasses.text} mb-3`}>{mission.description}</p>

                    <div>
                      <span className={`${themeClasses.textMuted} text-sm`}>Outcome:</span>
                      <span className={`${themeClasses.text} ml-2`}>{mission.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mission simulator */}
              <div
                className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50 border ${themeClasses.border}`}
              >
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Mission Simulator</h4>
                <p className={`${themeClasses.text} mb-4`}>
                  Run a simulation of this ship in various mission scenarios to evaluate performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    className={`p-3 rounded-lg ${themeClasses.accentBg} text-white font-sci-fi text-sm hover:opacity-90 transition-opacity`}
                    onClick={() =>
                      toast({
                        title: "Simulation Started",
                        description: `Combat scenario simulation for ${ship.name} is now running.`,
                      })
                    }
                  >
                    COMBAT SCENARIO
                  </button>
                  <button
                    className={`p-3 rounded-lg ${themeClasses.accentBg} text-white font-sci-fi text-sm hover:opacity-90 transition-opacity`}
                    onClick={() =>
                      toast({
                        title: "Simulation Started",
                        description: `Reconnaissance mission simulation for ${ship.name} is now running.`,
                      })
                    }
                  >
                    RECONNAISSANCE
                  </button>
                  <button
                    className={`p-3 rounded-lg ${themeClasses.accentBg} text-white font-sci-fi text-sm hover:opacity-90 transition-opacity`}
                    onClick={() =>
                      toast({
                        title: "Simulation Started",
                        description: `Escort duty simulation for ${ship.name} is now running.`,
                      })
                    }
                  >
                    ESCORT DUTY
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personnel" && ship?.personnel && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>Personnel Records</h3>

              <div>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Notable Crew</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ship.personnel.notableCrew.map((crewMember, index) => (
                    <div key={index} className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                      <h5 className={`${themeClasses.text} font-bold`}>{crewMember.name}</h5>
                      <div className={`${themeClasses.accent} text-sm mb-2`}>{crewMember.rank}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {crewMember.species && (
                          <div>
                            <span className={`${themeClasses.textMuted}`}>Species:</span>
                            <span className={`${themeClasses.text} ml-1`}>{crewMember.species}</span>
                          </div>
                        )}
                        {crewMember.role && (
                          <div>
                            <span className={`${themeClasses.textMuted}`}>Role:</span>
                            <span className={`${themeClasses.text} ml-1`}>{crewMember.role}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ship.personnel.standardComplement && (
                <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                  <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Standard Complement</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ship.personnel.standardComplement.officers !== undefined && (
                      <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                        <div className={`${themeClasses.accent} text-lg font-bold`}>
                          {ship.personnel.standardComplement.officers.toLocaleString()}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>Officers</div>
                      </div>
                    )}
                    {ship.personnel.standardComplement.enlisted !== undefined && (
                      <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                        <div className={`${themeClasses.accent} text-lg font-bold`}>
                          {ship.personnel.standardComplement.enlisted.toLocaleString()}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>Enlisted</div>
                      </div>
                    )}
                    {ship.personnel.standardComplement.troops !== undefined && (
                      <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                        <div className={`${themeClasses.accent} text-lg font-bold`}>
                          {ship.personnel.standardComplement.troops.toLocaleString()}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>Troops</div>
                      </div>
                    )}
                    {ship.personnel.standardComplement.droids !== undefined && (
                      <div className="text-center p-3 bg-black bg-opacity-30 rounded-lg">
                        <div className={`${themeClasses.accent} text-lg font-bold`}>
                          {typeof ship.personnel.standardComplement.droids === "number"
                            ? ship.personnel.standardComplement.droids.toLocaleString()
                            : ship.personnel.standardComplement.droids}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>Droids</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crew quarters visualization */}
              <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Crew Quarters Distribution</h4>
                <div className="aspect-video bg-black bg-opacity-50 rounded-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-sm ${themeClasses.textMuted}`}>
                      [Crew quarters visualization - Access restricted]
                    </div>
                  </div>

                  {/* Simplified ship outline */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div
                      className={`w-3/4 h-1/2 ${
                        ship.class.toLowerCase().includes("destroyer")
                          ? "trapezoid"
                          : ship.id === "millennium-falcon"
                            ? "rounded-full"
                            : "rectangle"
                      } border border-gray-500`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Training simulator */}
              <div
                className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50 border ${themeClasses.border}`}
              >
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Crew Training Simulator</h4>
                <p className={`${themeClasses.text} mb-4`}>Access training modules for this vessel's crew positions.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    className={`p-3 rounded-lg bg-gray-700 text-white font-sci-fi text-sm hover:bg-gray-600 transition-colors`}
                    onClick={() =>
                      toast({
                        title: "Training Module",
                        description: `Pilot training module for ${ship.name} is loading.`,
                      })
                    }
                  >
                    PILOT TRAINING
                  </button>
                  <button
                    className={`p-3 rounded-lg bg-gray-700 text-white font-sci-fi text-sm hover:bg-gray-600 transition-colors`}
                    onClick={() =>
                      toast({
                        title: "Training Module",
                        description: `Engineering training module for ${ship.name} is loading.`,
                      })
                    }
                  >
                    ENGINEERING
                  </button>
                  <button
                    className={`p-3 rounded-lg bg-gray-700 text-white font-sci-fi text-sm hover:bg-gray-600 transition-colors`}
                    onClick={() =>
                      toast({
                        title: "Training Module",
                        description: `Weapons systems training module for ${ship.name} is loading.`,
                      })
                    }
                  >
                    WEAPONS SYSTEMS
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "3d" && (
            <div className="space-y-6">
              <h3 className={`text-lg font-sci-fi ${themeClasses.accent} mb-4`}>3D Model Viewer</h3>

              <div className="aspect-video bg-black bg-opacity-70 rounded-lg relative overflow-hidden">
                {/* This would be a 3D model viewer in a real app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-lg ${themeClasses.accent} font-sci-fi mb-2`}>{ship.name}</div>
                    <div className={`text-sm ${themeClasses.textMuted}`}>3D model loading... Please wait</div>
                    <div className="mt-4">
                      <div
                        className={`w-16 h-16 border-4 ${themeClasses.border} border-t-transparent rounded-full animate-spin mx-auto`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Grid lines */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>

              {/* Model controls */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  className={`px-4 py-2 rounded-lg ${themeClasses.backgroundLight} text-white font-sci-fi text-sm hover:bg-opacity-80 transition-opacity flex items-center`}
                  onClick={() =>
                    toast({
                      title: "View Changed",
                      description: "Switching to exterior view.",
                    })
                  }
                >
                  <Shield className="h-4 w-4 mr-2" /> EXTERIOR VIEW
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${themeClasses.backgroundLight} text-white font-sci-fi text-sm hover:bg-opacity-80 transition-opacity flex items-center`}
                  onClick={() =>
                    toast({
                      title: "View Changed",
                      description: "Switching to interior view.",
                    })
                  }
                >
                  <Users className="h-4 w-4 mr-2" /> INTERIOR VIEW
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${themeClasses.backgroundLight} text-white font-sci-fi text-sm hover:bg-opacity-80 transition-opacity flex items-center`}
                  onClick={() =>
                    toast({
                      title: "View Changed",
                      description: "Switching to wireframe view.",
                    })
                  }
                >
                  <Map className="h-4 w-4 mr-2" /> WIREFRAME
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${themeClasses.backgroundLight} text-white font-sci-fi text-sm hover:bg-opacity-80 transition-opacity flex items-center`}
                  onClick={() =>
                    toast({
                      title: "View Changed",
                      description: "Switching to cross-section view.",
                    })
                  }
                >
                  <Crosshair className="h-4 w-4 mr-2" /> CROSS-SECTION
                </button>
              </div>

              {/* Technical specifications */}
              <div className={`p-4 rounded-lg ${themeClasses.backgroundLight} bg-opacity-50`}>
                <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Model Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className={themeClasses.textMuted}>Model Version</div>
                    <div className={themeClasses.text}>v2.3.7</div>
                  </div>
                  <div>
                    <div className={themeClasses.textMuted}>Polygon Count</div>
                    <div className={themeClasses.text}>
                      {ship.class.toLowerCase().includes("destroyer")
                        ? "1.2M"
                        : ship.id === "millennium-falcon"
                          ? "850K"
                          : "350K"}
                    </div>
                  </div>
                  <div>
                    <div className={themeClasses.textMuted}>Texture Resolution</div>
                    <div className={themeClasses.text}>4K</div>
                  </div>
                  <div>
                    <div className={themeClasses.textMuted}>Last Updated</div>
                    <div className={themeClasses.text}>15.3.35 ABY</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasExtendedInfo && activeTab !== "specs" && activeTab !== "3d" && (
            <div className="p-6 text-center">
              <FileText className={`h-12 w-12 ${themeClasses.textMuted} mx-auto mb-4`} />
              <p className={`${themeClasses.accent} font-sci-fi`}>Extended information unavailable</p>
              <p className={`${themeClasses.textMuted} mt-2`}>
                This ship does not have detailed {activeTab} information in the database.
              </p>
            </div>
          )}
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
    accent: theme === "empire" ? "text-red-500" : "text-orange-500",
    accentSecondary: theme === "empire" ? "text-yellow-400" : "text-blue-300",
    text: theme === "empire" ? "text-gray-200" : "text-gray-200",
    border: theme === "empire" ? "border-red-900/30" : "border-orange-900/30",
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
