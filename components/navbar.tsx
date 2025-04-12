"use client"

import Link from "next/link"
import { Home, Menu, Users, X, Sparkles } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5 mr-2" />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold"
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <span className="font-bold text-foreground">Community Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-bold">Community Hub</span>
                </div>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col gap-4 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`flex items-center py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === route.path ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
