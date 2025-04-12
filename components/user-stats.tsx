"use client"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"

interface UserStatsProps {
  totalUsers: number
}

export function UserStats({ totalUsers }: UserStatsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        className="text-5xl font-bold text-primary"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AnimatedCounter to={totalUsers} />
      </motion.div>
      <p className="text-muted-foreground mt-2">Total Members</p>

      <div className="w-full mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Growth</span>
          <span className="font-medium">+12% this month</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <motion.div
        className="mt-6 grid grid-cols-2 gap-4 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-lg border p-3 text-center">
          <p className="text-sm text-muted-foreground">Active Today</p>
          <p className="text-xl font-bold text-primary mt-1">
            <AnimatedCounter to={Math.min(totalUsers, 5)} />
          </p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-sm text-muted-foreground">New This Week</p>
          <p className="text-xl font-bold text-primary mt-1">
            <AnimatedCounter to={Math.min(totalUsers, 8)} />
          </p>
        </div>
      </motion.div>
    </div>
  )
}
