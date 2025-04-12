"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  opacity: number
  blur: number
  shape: "circle" | "square" | "triangle"
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const colors = [
      "rgba(236, 72, 153, 0.3)", // pink-500
      "rgba(139, 92, 246, 0.3)", // violet-500
      "rgba(6, 182, 212, 0.3)", // cyan-500
      "rgba(16, 185, 129, 0.3)", // emerald-500
    ]

    const shapes = ["circle", "square", "triangle"] as const

    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
        blur: Math.random() * 5 + 2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }))

      setParticles(newParticles)
    }

    generateParticles()

    const handleResize = () => {
      generateParticles()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: `blur(${particle.blur}px)`,
            borderRadius: particle.shape === "circle" ? "50%" : particle.shape === "square" ? "0" : "0",
            backgroundColor: particle.shape !== "triangle" ? particle.color : "transparent",
            clipPath:
              particle.shape === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : particle.shape === "square"
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                  : "none",
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: particle.shape === "triangle" ? [0, 360, 0] : [0, 0, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
