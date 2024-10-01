"use client"

// components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer"
import RegisterForm from "@/components/auth/register/form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

// hooks
import { useMediaQuery } from "@/lib/hooks/utils/use-media-query"
import { useState } from "react"

const CreateUserModal = () => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const handleClose = () => {
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} aria-describedby={undefined}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="shadow-sm">
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            New User
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user.
            </DialogDescription>
          </DialogHeader>

          <RegisterForm
            status="admin"
            onSuccess={handleClose}
            onError={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New User
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-5">
        <DrawerHeader>
          <DrawerTitle>Create user</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new user.
          </DrawerDescription>
        </DrawerHeader>

        <RegisterForm onSuccess={handleClose} onError={handleClose} />
      </DrawerContent>
    </Drawer>
  )
}

export default CreateUserModal
