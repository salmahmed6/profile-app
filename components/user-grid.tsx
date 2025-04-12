"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Award, Calendar } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserDialog } from "@/components/user-dialog"

interface UserType {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  createdAt: string
}

interface UserGridProps {
  users: UserType[]
}

export function UserGrid({ users }: UserGridProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  function handleUserClick(user: UserType) {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  // Calculate join date in days ago
  function getJoinDate(dateString: string) {
    const joinDate = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - joinDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            variants={item}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            <Card
              className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg cursor-pointer bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-muted"
              onClick={() => handleUserClick(user)}
            >
              <CardHeader className="p-0">
                <div className="h-24 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 animate-gradient-x" />
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="-mt-12 flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 * index }}
                  >
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-pink-500 to-violet-500 text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
                <div className="mt-3 text-center">
                  <motion.h3
                    className="text-lg font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + 0.1 * index }}
                  >
                    {user.name}
                  </motion.h3>
                  <motion.p
                    className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + 0.1 * index }}
                  >
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </motion.p>
                  {user.bio && (
                    <motion.p
                      className="text-sm mt-2 line-clamp-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + 0.1 * index }}
                    >
                      {user.bio}
                    </motion.p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Badge variant="outline" className="bg-primary/10 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {getJoinDate(user.createdAt)}
                </Badge>
                {index < 3 && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Top Member
                  </Badge>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedUser && <UserDialog user={selectedUser} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </>
  )
}
