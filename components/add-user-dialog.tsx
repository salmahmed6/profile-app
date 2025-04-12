"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useActivity } from "@/context/activity-context"
import { createUser } from "@/lib/api-utils"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addActivity } = useActivity()
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation errors when user starts typing
    setValidationErrors([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setValidationErrors([])

    try {
      // Basic client-side validation
      const errors = []
      if (formData.name.length < 2) {
        errors.push("Name must be at least 2 characters")
      }
      if (formData.name.length > 50) {
        errors.push("Name must be less than 50 characters")
      }
      if (!formData.email.includes("@")) {
        errors.push("Email must be valid")
      }
      if (formData.bio && formData.bio.length > 500) {
        errors.push("Bio must be less than 500 characters")
      }

      if (errors.length > 0) {
        setValidationErrors(errors)
        throw new Error("Please fix the validation errors")
      }

      // Create user with fallback to mock data
      console.log("Submitting user data:", formData)
      const newUser = await createUser(formData)
      console.log("User created:", newUser)

      // Add activity
      addActivity({
        type: "join",
        message: `${formData.name} joined the community`,
        user: {
          id: newUser.id,
          name: formData.name,
          avatarUrl: formData.avatarUrl || "/placeholder.svg",
        },
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        bio: "",
        avatarUrl: "",
      })

      toast({
        title: "Success!",
        description: "User has been created successfully.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating user:", error)

      // Only show toast for non-validation errors
      if (validationErrors.length === 0) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? `${error.message}. Using mock data instead.`
              : "Failed to create user. Using mock data instead.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Fill in the details to add a new user to the community.</DialogDescription>
        </DialogHeader>

        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">2-50 characters</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about this user..."
                value={formData.bio}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Maximum 500 characters</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
