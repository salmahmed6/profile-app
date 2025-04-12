"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WavyBackgroundProps {
  className?: string
}

export function WavyBackground({ className = "" }: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      time += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw multiple waves with different parameters
      drawWave(ctx, time, canvas.width, canvas.height, 0.5, "rgba(236, 72, 153, 0.03)") // Pink
      drawWave(ctx, time * 0.8, canvas.width, canvas.height, 0.3, "rgba(139, 92, 246, 0.03)") // Violet
      drawWave(ctx, time * 1.2, canvas.width, canvas.height, 0.2, "rgba(6, 182, 212, 0.03)") // Cyan

      animationFrameId = requestAnimationFrame(animate)
    }

    const drawWave = (
      context: CanvasRenderingContext2D,
      t: number,
      width: number,
      height: number,
      amplitude: number,
      color: string,
    ) => {
      context.beginPath()
      context.moveTo(0, height / 2)

      const waveHeight = height * amplitude
      const frequency = 0.01

      for (let x = 0; x < width; x++) {
        const y = Math.sin(x * frequency + t) * waveHeight + height / 2
        context.lineTo(x, y)
      }

      context.lineTo(width, height)
      context.lineTo(0, height)
      context.closePath()
      context.fillStyle = color
      context.fill()
    }

    resize()
    window.addEventListener("resize", resize)
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`absolute inset-0 ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  )
}
