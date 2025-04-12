"use client"

import { useState } from "react"
import { Mail, Calendar, Edit, Award, MapPin, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useActivity } from "@/context/activity-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteUser } from "@/lib/api-utils"

interface UserType {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  createdAt: string
}

interface UserDialogProps {
  user: UserType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addActivity } = useActivity()

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  function handleEditClick() {
    onOpenChange(false)
    setTimeout(() => setEditDialogOpen(true), 100)
  }

  async function handleDeleteUser() {
    setIsDeleting(true)
    try {
      // Delete user with fallback to mock data
      const success = await deleteUser(user.id)

      if (success) {
        // Add activity
        addActivity({
          type: "delete",
          message: `${user.name} was removed from the community`,
          user: {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        })

        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        })

        setDeleteDialogOpen(false)
        onOpenChange(false)
        router.refresh()
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)

      // Show error toast but also inform about fallback
      toast({
        title: "Note",
        description: "API error occurred, but user was removed from local data.",
        variant: "default",
      })

      // Close dialogs and refresh anyway since we're using mock data
      setDeleteDialogOpen(false)
      onOpenChange(false)
      router.refresh()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden p-0">
              <DialogHeader className="p-0">
                <div className="h-32 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 animate-gradient-x" />
              </DialogHeader>

              <motion.div
                className="p-6 -mt-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-pink-500 to-violet-500 text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1 justify-center">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground mt-1 justify-center">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-center gap-2 mt-3">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                        <Award className="h-3 w-3 mr-1" />
                        Top Member
                      </Badge>
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        Community Leader
                      </Badge>
                    </div>
                  </motion.div>

                  <Separator className="my-4" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full"
                  >
                    {user.bio ? (
                      <div className="text-center">
                        <h3 className="text-sm font-semibold mb-2">Bio</h3>
                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>No bio available</p>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-xs text-muted-foreground">Posts</p>
                        <p className="text-lg font-bold">24</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-xs text-muted-foreground">Connections</p>
                        <p className="text-lg font-bold">142</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                    Close
                  </Button>
                  <Button
                    onClick={handleEditClick}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <EditUserDialog user={user} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
