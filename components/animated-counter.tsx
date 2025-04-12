"use client"

import { useEffect, useState } from "react"
import { useMotionValue, useTransform, motion, animate } from "framer-motion"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ from = 0, to, duration = 2, className = "" }: AnimatedCounterProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    const controls = animate(count, to, { duration })

    const unsubscribe = rounded.onChange(setDisplayValue)

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, rounded, to, duration])

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {displayValue}
    </motion.span>
  )
}
