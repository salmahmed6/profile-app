"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
        animate={{ scale: theme === "dark" ? 0 : 1, opacity: theme === "dark" ? 0 : 1, rotate: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="absolute"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: 30 }}
        animate={{ scale: theme === "dark" ? 1 : 0, opacity: theme === "dark" ? 1 : 0, rotate: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="absolute"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
