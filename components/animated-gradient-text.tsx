"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <div className="relative">
      {/* Shadow/glow effect */}
      <motion.h1
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent blur-xl opacity-30",
          className,
        )}
        style={{
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.h1>

      {/* Main text */}
      <motion.h1
        className={cn(
          "relative bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent",
          className,
        )}
        style={{
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.h1>
    </div>
  )
}
