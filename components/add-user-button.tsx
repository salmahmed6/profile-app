"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { motion } from "framer-motion"

import { Button, type ButtonProps } from "@/components/ui/button"
import { AddUserDialog } from "@/components/add-user-dialog"

interface AddUserButtonProps extends ButtonProps {}

export function AddUserButton({ className, ...props }: AddUserButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={() => setDialogOpen(true)} className={className} {...props}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </motion.div>

      <AddUserDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
