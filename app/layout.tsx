import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { ActivityProvider } from "@/context/activity-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Community App",
  description: "Connect with amazing people and build your network",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <ActivityProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              {children}
              <Toaster />
            </div>
          </ActivityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'