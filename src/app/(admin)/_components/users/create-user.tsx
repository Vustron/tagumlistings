"use client"

// components
import RegisterForm from "@/app/(auth)/_components/register/form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PlusIcon } from "lucide-react"

// hooks
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { useState } from "react"

const CreateUserModal = () => {
  // init open state
  const [open, setOpen] = useState(false)

  // init media query
  const isDesktop = useMediaQuery("(min-width: 640px)")

  // handler to close dialog
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
