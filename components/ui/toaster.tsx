"use client"

import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white"
                : toast.variant === "success"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-sci-fi text-sm">{toast.title}</h3>
                <p className="text-xs mt-1 opacity-90">{toast.description}</p>
              </div>
              <button className="ml-4 text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
