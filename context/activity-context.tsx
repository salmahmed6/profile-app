"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Activity } from "@/components/activity-feed"

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])

  // Load activities from localStorage on mount
  useEffect(() => {
    try {
      const savedActivities = localStorage.getItem("community-activities")
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities))
      }
    } catch (error) {
      console.error("Failed to load activities from localStorage:", error)
    }
  }, [])

  // Save activities to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("community-activities", JSON.stringify(activities))
    } catch (error) {
      console.error("Failed to save activities to localStorage:", error)
    }
  }, [activities])

  const addActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    }

    setActivities((prev) => [newActivity, ...prev].slice(0, 20)) // Keep only the 20 most recent activities
  }

  const clearActivities = () => {
    setActivities([])
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>{children}</ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider")
  }
  return context
}
