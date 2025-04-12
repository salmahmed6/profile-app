"use client"

import Link from "next/link"
import { Users, Search, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { AddUserButton } from "@/components/add-user-button"

export function QuickActions() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <AddUserButton className="w-full justify-start bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-md hover:shadow-lg transition-all duration-300" />
      </motion.div>

      <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link href="/users">
          <Button
            variant="outline"
            className="w-full justify-start group shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Users className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
            View All Users
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant="outline"
          className="w-full justify-start group shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Search className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
          Search Community
        </Button>
      </motion.div>

      <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant="outline"
          className="w-full justify-start group shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Zap className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
          Quick Connect
        </Button>
      </motion.div>
    </motion.div>
  )
}
