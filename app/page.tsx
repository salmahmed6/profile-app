"use client"

import Link from "next/link"
import { ArrowRight, Users, Sparkles, Zap, Globe, Star, Shield, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStats } from "@/components/user-stats"
import { QuickActions } from "@/components/quick-actions"
import { AnimatedGradientText } from "@/components/animated-gradient-text"
import { FloatingParticles } from "@/components/floating-particles"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { StatsCard } from "@/components/stats-card"
import { WavyBackground } from "@/components/wavy-background"
import { ActivityFeed } from "@/components/activity-feed"
import { useActivity } from "@/context/activity-context"
import { fetchUsers } from "@/lib/api-utils"

export default function Home() {
  const { activities } = useActivity()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const { users: fetchedUsers, error: fetchError, responseText } = await fetchUsers()
        setUsers(fetchedUsers)

        if (fetchError) {
          setError(fetchError)
          setResponseText(responseText)
          console.warn("Using mock data due to API error:", fetchError)
        } else {
          setError(null)
          setResponseText("")
        }
      } catch (err) {
        console.error("Error in loadUsers:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const totalUsers = users.length || 120 // Default value for animation

  // Features data
  const features = [
    {
      icon: <Globe className="h-10 w-10 text-cyan-500" />,
      title: "Global Community",
      description: "Connect with members from around the world and expand your network internationally.",
    },
    {
      icon: <Shield className="h-10 w-10 text-violet-500" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-pink-500" />,
      title: "Real-time Chat",
      description: "Communicate instantly with other community members through our messaging system.",
    },
    {
      icon: <Star className="h-10 w-10 text-amber-500" />,
      title: "Exclusive Events",
      description: "Participate in members-only events, webinars, and networking opportunities.",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Community Leader",
      content:
        "This platform has transformed how I connect with like-minded professionals. The interface is intuitive and the community is incredibly supportive.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Sarah Williams",
      role: "Tech Entrepreneur",
      content:
        "I've met incredible collaborators through this community. The features make networking effortless and enjoyable.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Michael Chen",
      role: "Product Designer",
      content:
        "As a designer, I appreciate the thoughtful UI and smooth experience. It's been invaluable for my professional growth.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Stats data
  const stats = [
    { label: "Active Members", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Countries", value: "120+", icon: <Globe className="h-5 w-5" /> },
    { label: "Events Hosted", value: "500+", icon: <Star className="h-5 w-5" /> },
    { label: "Success Stories", value: "2,500+", icon: <MessageSquare className="h-5 w-5" /> },
  ]

  return (
    <main className="relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <WavyBackground className="absolute inset-0 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <AnimatedGradientText className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Welcome to Community Hub
              </AnimatedGradientText>
            </motion.div>
            <motion.p
              className="text-muted-foreground max-w-2xl text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connect with amazing people and build your network. Our community is growing every day!
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/users">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="shadow-lg hover:shadow-xl transition-all duration-300">
                Learn More
              </Button>
            </motion.div>
          </div>

          {error && (
            <div className="mb-8 p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 rounded-md max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Error connecting to API</h3>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">
                Make sure your backend server is running and{" "}
                <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL</code> is set
                correctly.
                <br />
                Current API URL:{" "}
                <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">
                  {process.env.NEXT_PUBLIC_API_URL || "/api"}
                </code>
              </p>
              {responseText && (
                <div className="mt-4">
                  <p className="text-sm font-semibold">Response preview:</p>
                  <pre className="text-xs bg-red-100 dark:bg-red-900/30 p-2 mt-1 rounded overflow-auto max-h-32">
                    {responseText.substring(0, 500)}
                    {responseText.length > 500 ? "..." : ""}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Stats
                  </CardTitle>
                  <CardDescription className="text-white/80">See how our community is growing</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <UserStats totalUsers={totalUsers} />
                </CardContent>
                <CardFooter>
                  <Link href="/users" className="w-full">
                    <Button variant="outline" className="w-full group">
                      View All Users
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-white/80">Quickly perform common tasks</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <QuickActions />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-1"
            >
              <ActivityFeed activities={activities} loading={isLoading} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover all the tools and features designed to enhance your community experience.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-violet-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Community in Numbers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of members already benefiting from our growing community.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} label={stat.label} value={stat.value} icon={stat.icon} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">What Our Members Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from our community members about their experiences.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                avatar={testimonial.avatar}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <WavyBackground className="absolute inset-0 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Join Our Growing Community
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Be part of something special. Connect with like-minded individuals and expand your network.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/users">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg"
                  >
                    Explore Community
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
