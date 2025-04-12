"use client"

import { useState } from "react"
import type { Starship } from "@/types/starship"
import { X, BarChart3, ArrowRight, Download } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface StarshipComparisonProps {
  ships: Starship[]
  theme: "empire" | "rebellion"
  onRemoveShip: (shipId: string) => void
}

export default function StarshipComparison({ ships, theme, onRemoveShip }: StarshipComparisonProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "visual" | "tactical">("specs")

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

  if (ships.length < 2) {
    return (
      <div className={`flex-grow flex items-center justify-center p-6 ${themeClasses.panelBg}`}>
        <div className="text-center space-y-4 max-w-md">
          <div className={`${themeClasses.accent} font-sci-fi text-2xl`}>Comparison Mode</div>
          <div className={`${themeClasses.textMuted} uppercase tracking-wider text-sm`}>
            Add at least 2 starships to compare their specifications
          </div>
          <div className="mt-4">
            <BarChart3 className={`h-16 w-16 ${themeClasses.textMuted} mx-auto opacity-30`} />
          </div>
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
    <div className={`flex-grow overflow-y-auto ${themeClasses.panelBg} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`${themeClasses.accentBg} w-10 h-10 rounded-br-full flex-shrink-0`}></div>
          <h2 className={`text-2xl md:text-3xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase ml-4`}>
            Starship Comparison
          </h2>
        </div>

        <button
          onClick={() => {
            // In a real app, this would generate a report
            alert("Comparison report generated")
          }}
          className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="font-sci-fi text-sm">Export Report</span>
        </button>
      </div>

      {/* Ship cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        {ships.map((ship) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative ${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg p-4 flex-grow min-w-[250px] max-w-[300px]`}
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

      {/* Tabs */}
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
          onClick={() => setActiveTab("visual")}
          className={`px-6 py-2 font-sci-fi uppercase text-sm transition-colors duration-200 flex-shrink-0 ${
            activeTab === "visual"
              ? `${themeClasses.accentSecondaryBg} text-black font-bold`
              : `${themeClasses.panelDarkBg} ${themeClasses.text} hover:bg-opacity-80`
          }`}
        >
          Visual Comparison
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

        <div className="flex-grow"></div>

        <div className={`${theme === "empire" ? "bg-red-700" : "bg-orange-500"} w-6 h-10 flex-shrink-0`}></div>
        <div className={`${themeClasses.accentBg} w-4 h-10 flex-shrink-0`}></div>
      </div>

      {/* Tab content */}
      <div className={`${themeClasses.panelDarkBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
        {activeTab === "specs" && (
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
                              className={`py-3 px-4 ${better ? themeClasses.accentSecondary : themeClasses.text}`}
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
        )}

        {activeTab === "visual" && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {ships.map((ship, index) => (
                <div key={ship.id} className="relative">
                  <div
                    className={`bg-black bg-opacity-70 border ${themeClasses.border} rounded-lg p-3 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                    <div className={`text-xs ${themeClasses.accent} font-sci-fi mb-2 text-center`}>{ship.name}</div>
                    <Image
                      src={`/placeholder.svg?height=200&width=300`}
                      alt={`${ship.name} visual`}
                      width={300}
                      height={200}
                      className="rounded"
                    />
                    <div className={`text-xs ${themeClasses.textMuted} mt-2 text-center`}>
                      {ship.class} • {ship.specs?.length || "Unknown length"}
                    </div>
                  </div>

                  {index < ships.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight className={`h-5 w-5 ${themeClasses.accent}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className={`${themeClasses.accent} font-sci-fi mb-4 text-center`}>Size Comparison</h3>
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
        )}

        {activeTab === "tactical" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Firepower comparison */}
              <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-4`}>Firepower</h4>
                {ships.map((ship) => {
                  // Calculate firepower rating based on ship type
                  let firepowerPercentage = 50 // default
                  if (ship.class.toLowerCase().includes("destroyer")) firepowerPercentage = 90
                  else if (ship.class.toLowerCase().includes("cruiser")) firepowerPercentage = 80
                  else if (ship.class.toLowerCase().includes("frigate")) firepowerPercentage = 60
                  else if (ship.class.toLowerCase().includes("fighter")) firepowerPercentage = 30
                  else if (ship.class.toLowerCase().includes("freighter")) firepowerPercentage = 40

                  return (
                    <div key={ship.id} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${themeClasses.text}`}>{ship.name}</span>
                        <span className={`text-xs ${themeClasses.textMuted}`}>
                          {firepowerPercentage >= 80
                            ? "Extreme"
                            : firepowerPercentage >= 60
                              ? "High"
                              : firepowerPercentage >= 40
                                ? "Moderate"
                                : "Low"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                          style={{ width: `${firepowerPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Durability comparison */}
              <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-4`}>Durability</h4>
                {ships.map((ship) => {
                  // Calculate durability rating based on ship type
                  let durabilityPercentage = 50 // default
                  if (ship.class.toLowerCase().includes("destroyer")) durabilityPercentage = 90
                  else if (ship.class.toLowerCase().includes("cruiser")) durabilityPercentage = 95
                  else if (ship.class.toLowerCase().includes("frigate")) durabilityPercentage = 70
                  else if (ship.class.toLowerCase().includes("fighter")) durabilityPercentage = 30
                  else if (ship.class.toLowerCase().includes("freighter")) durabilityPercentage = 60

                  // Adjust for faction
                  if (ship.faction.toLowerCase().includes("empire")) durabilityPercentage *= 0.9
                  else if (ship.faction.toLowerCase().includes("rebellion")) durabilityPercentage *= 1.1

                  durabilityPercentage = Math.min(100, durabilityPercentage)

                  return (
                    <div key={ship.id} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${themeClasses.text}`}>{ship.name}</span>
                        <span className={`text-xs ${themeClasses.textMuted}`}>
                          {durabilityPercentage >= 90
                            ? "Extreme"
                            : durabilityPercentage >= 70
                              ? "High"
                              : durabilityPercentage >= 40
                                ? "Moderate"
                                : "Low"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                          style={{ width: `${durabilityPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Speed comparison */}
              <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
                <h4 className={`${themeClasses.accent} font-sci-fi text-center mb-4`}>Speed</h4>
                {ships.map((ship) => {
                  // Calculate speed rating based on ship type
                  let speedPercentage = 50 // default
                  if (ship.class.toLowerCase().includes("destroyer")) speedPercentage = 30
                  else if (ship.class.toLowerCase().includes("cruiser")) speedPercentage = 35
                  else if (ship.class.toLowerCase().includes("frigate")) speedPercentage = 60
                  else if (ship.class.toLowerCase().includes("fighter")) speedPercentage = 85
                  else if (ship.class.toLowerCase().includes("freighter")) speedPercentage = 40

                  // Special case for Millennium Falcon
                  if (ship.name.toLowerCase().includes("falcon")) speedPercentage = 95

                  return (
                    <div key={ship.id} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${themeClasses.text}`}>{ship.name}</span>
                        <span className={`text-xs ${themeClasses.textMuted}`}>
                          {speedPercentage >= 80
                            ? "Extreme"
                            : speedPercentage >= 60
                              ? "High"
                              : speedPercentage >= 40
                                ? "Moderate"
                                : "Low"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme === "empire" ? "bg-red-600" : "bg-yellow-500"}`}
                          style={{ width: `${speedPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`border ${themeClasses.border} bg-black bg-opacity-30 p-4 rounded-lg`}>
              <h4 className={`${themeClasses.accent} font-sci-fi mb-3`}>Tactical Assessment</h4>
              <p className={`${themeClasses.text} text-sm mb-4`}>
                Based on the comparative analysis of the selected vessels, the following tactical assessment has been
                generated:
              </p>

              {ships.length === 2 && (
                <div className="p-4 border border-gray-700 rounded bg-black bg-opacity-30">
                  <p className={`${themeClasses.text}`}>
                    <span className={themeClasses.accent}>{ships[0].name}</span> vs{" "}
                    <span className={themeClasses.accent}>{ships[1].name}</span>:{" "}
                    {getTacticalComparison(ships[0], ships[1])}
                  </p>
                </div>
              )}

              {ships.length > 2 && (
                <div className="space-y-3">
                  {ships.map((ship) => (
                    <div key={ship.id} className="p-3 border border-gray-700 rounded bg-black bg-opacity-30">
                      <h5 className={`${themeClasses.accent} font-sci-fi mb-1`}>{ship.name}</h5>
                      <p className={`${themeClasses.text} text-sm`}>{getFleetRole(ship)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to generate tactical comparison between two ships
function getTacticalComparison(ship1: Starship, ship2: Starship): string {
  // Capital ships vs small craft
  if (
    (ship1.class.toLowerCase().includes("destroyer") || ship1.class.toLowerCase().includes("cruiser")) &&
    (ship2.class.toLowerCase().includes("fighter") || ship2.class.toLowerCase().includes("freighter"))
  ) {
    return `In a direct confrontation, the ${ship1.name} would overwhelm the ${ship2.name} with superior firepower and defensive systems. However, the ${ship2.name}'s smaller profile and greater maneuverability would make it a difficult target to engage effectively with the ${ship1.name}'s primary weapons systems.`
  }

  if (
    (ship2.class.toLowerCase().includes("destroyer") || ship2.class.toLowerCase().includes("cruiser")) &&
    (ship1.class.toLowerCase().includes("fighter") || ship1.class.toLowerCase().includes("freighter"))
  ) {
    return `The ${ship2.name} possesses overwhelming firepower compared to the ${ship1.name}. In a direct engagement, the ${ship1.name} would need to exploit its superior maneuverability and smaller profile to avoid the ${ship2.name}'s primary weapon systems and target vulnerable points.`
  }

  // Similar class ships
  if (ship1.class === ship2.class) {
    if (ship1.faction === ship2.faction) {
      return `Both vessels share similar tactical profiles as they are of the same class and faction. Any advantage would come from crew experience, specific modifications, or tactical positioning rather than inherent design differences.`
    } else {
      return `While both vessels share the same class designation, their different faction origins result in distinct design philosophies. ${ship1.faction} vessels typically favor ${ship1.faction === "Empire" ? "overwhelming firepower and intimidation" : "adaptability and resilience"}, while ${ship2.faction} designs emphasize ${ship2.faction === "Empire" ? "overwhelming firepower and intimidation" : "adaptability and resilience"}.`
    }
  }

  // Generic comparison
  return `These vessels serve different tactical roles in their respective fleets. The ${ship1.name} is optimized for ${getShipPurpose(ship1)}, while the ${ship2.name} excels at ${getShipPurpose(ship2)}. In a direct confrontation, tactical positioning and crew expertise would be decisive factors.`
}

// Helper function to determine a ship's primary purpose
function getShipPurpose(ship: Starship): string {
  if (ship.class.toLowerCase().includes("destroyer")) return "fleet engagements and planetary bombardment"
  if (ship.class.toLowerCase().includes("cruiser")) return "sustained combat operations and fleet support"
  if (ship.class.toLowerCase().includes("frigate")) return "escort duties and patrol operations"
  if (ship.class.toLowerCase().includes("fighter")) return "space superiority and strike missions"
  if (ship.class.toLowerCase().includes("freighter")) return "cargo transport with limited defensive capabilities"
  if (ship.class.toLowerCase().includes("corvette")) return "rapid response and light combat operations"
  return "various mission profiles depending on specific configuration"
}

// Helper function to determine a ship's role in a fleet
function getFleetRole(ship: Starship): string {
  if (ship.class.toLowerCase().includes("destroyer")) {
    return `As a ${ship.class}, the ${ship.name} would serve as the backbone of a fleet, providing heavy firepower and command capabilities. It would be supported by smaller vessels for screening and reconnaissance.`
  }
  if (ship.class.toLowerCase().includes("cruiser")) {
    return `The ${ship.name} would function as a versatile command vessel, capable of independent operations or serving as a fleet coordinator. Its balanced capabilities make it adaptable to various mission profiles.`
  }
  if (ship.class.toLowerCase().includes("frigate")) {
    return `In a fleet composition, the ${ship.name} would provide escort for larger vessels and engage enemy ships of similar class. Its moderate size balances firepower with maneuverability.`
  }
  if (ship.class.toLowerCase().includes("fighter")) {
    return `The ${ship.name} would operate in squadrons to provide space superiority, intercept enemy fighters, and conduct strike missions against larger vessels' vulnerable points.`
  }
  if (ship.class.toLowerCase().includes("freighter")) {
    return `While not primarily a combat vessel, the ${ship.name} could serve in support roles for fleet operations, providing logistics and transport capabilities. In combat situations, it would require escort protection.`
  }
  return `The ${ship.name} would fulfill specialized roles within a fleet structure based on its unique capabilities and the tactical requirements of specific missions.`
}
