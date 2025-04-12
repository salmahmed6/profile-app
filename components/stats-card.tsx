"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string
  index: number
}

export function StatsCard({ icon, label, value, index }: StatsCardProps) {
  // Extract the numeric part for animation
  const numericValue = Number.parseInt(value.replace(/\D/g, ""))

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-3xl font-bold mb-2">
            <AnimatedCounter to={numericValue} />
            {value.includes("+") ? "+" : ""}
          </h3>
          <p className="text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
