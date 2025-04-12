"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export interface Activity {
  id: string
  type: "join" | "update" | "delete" | "other"
  message: string
  timestamp: string
  user?: {
    id: string
    name: string
    avatarUrl?: string
  }
}

interface ActivityFeedProps {
  activities: Activity[]
  loading?: boolean
}

export function ActivityFeed({ activities, loading = false }: ActivityFeedProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "join":
        return "👋"
      case "update":
        return "✏️"
      case "delete":
        return "🗑️"
      default:
        return "📣"
    }
  }

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (e) {
      return "recently"
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm h-full">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
        <CardTitle className="flex items-center gap-2">Activity Feed</CardTitle>
        <CardDescription className="text-white/80">Recent activity in the community</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 max-h-[300px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <AnimatePresence initial={false}>
            <div className="space-y-4">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  {activity.user ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-primary-foreground">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold">
                      {getActivityIcon(activity.type)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
