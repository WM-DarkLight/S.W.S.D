"use client"

import { useState } from "react"
import { Clock, Trash2, Search } from "lucide-react"
import { motion } from "framer-motion"

interface SearchHistoryProps {
  history: string[]
  theme: "empire" | "rebellion"
  onSelectTerm: (term: string) => void
  onClearHistory: () => void
}

export default function SearchHistory({ history, theme, onSelectTerm, onClearHistory }: SearchHistoryProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

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

  return (
    <div className={`flex-grow overflow-y-auto ${themeClasses.panelBg} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`${themeClasses.accentBg} w-10 h-10 rounded-br-full flex-shrink-0`}></div>
          <h2 className={`text-2xl md:text-3xl font-sci-fi ${themeClasses.accent} tracking-wider uppercase ml-4`}>
            Search History
          </h2>
        </div>

        {!isConfirmingClear ? (
          <button
            onClick={() => setIsConfirmingClear(true)}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            disabled={history.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="font-sci-fi text-sm">Clear History</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className={`${themeClasses.textMuted} text-sm`}>Confirm clear?</span>
            <button
              onClick={onClearHistory}
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
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className={`h-12 w-12 ${themeClasses.textMuted} mx-auto mb-4 opacity-50`} />
            <p className={`${themeClasses.textMuted} font-sci-fi`}>No search history available</p>
            <p className={`${themeClasses.textMuted} text-sm mt-2`}>
              Your search queries will appear here for quick reference
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {history.map((term, index) => (
              <motion.li
                key={`${term}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 hover:bg-black hover:bg-opacity-30 cursor-pointer transition-colors duration-200`}
                onClick={() => onSelectTerm(term)}
              >
                <div className="flex items-center">
                  <Search className={`h-4 w-4 ${themeClasses.accent} mr-3`} />
                  <span className={themeClasses.text}>{term}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 border border-gray-800 rounded-lg bg-black bg-opacity-30">
        <h3 className={`${themeClasses.accent} font-sci-fi mb-3`}>Search Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Total Searches</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>{history.length}</div>
          </div>
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Most Recent</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>
              {history.length > 0 ? history[0] : "None"}
            </div>
          </div>
          <div className="p-3 border border-gray-800 rounded-lg bg-black bg-opacity-20">
            <div className={`text-sm ${themeClasses.textMuted} mb-1`}>Search Patterns</div>
            <div className={`text-xl ${themeClasses.accent} font-sci-fi`}>
              {history.some((term) => term.toLowerCase().includes("imperial")) ? "Imperial" : "Varied"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
