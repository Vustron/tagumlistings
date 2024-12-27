"use client"

// components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import VisuallyHiddenComponent from "@/components/ui/visually-hidden"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

// hooks
import { useState } from "react"

// types
import type { Message } from "@/lib/types"

interface EditMessageDialogProps {
  msg: Message
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  handleSaveEdit: (content: string) => void
}

export default function EditMessageDialog({
  msg,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleSaveEdit,
}: EditMessageDialogProps) {
  const [editContent, setEditContent] = useState(msg.content || "")

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <VisuallyHiddenComponent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Message</DialogTitle>
        </DialogHeader>
      </VisuallyHiddenComponent>

      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-1"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <PencilIcon className="size-4 dark:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-semibold">Edit Message</h2>
        <textarea
          className="w-full mt-2 p-2 border rounded"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
        <Button
          className="mt-4 bg-green-500 text-white hover:bg-green-400"
          onClick={() => handleSaveEdit(editContent)}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}
