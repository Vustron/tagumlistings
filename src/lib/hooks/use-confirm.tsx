// components
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// hooks
import { useState } from "react"

//types
import type { JSX } from "react"

export const useConfirm = (
  title: string,
  message: string,
  verification?: "Verification",
): [() => JSX.Element, () => Promise<unknown>] => {
  // init promise state
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  // init confirm
  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve })
    })

  // init handle close
  const handleClose = () => {
    setPromise(null)
  }

  // init handle confirm
  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  // init handle cancel
  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          {verification ? (
            <>
              <Button onClick={handleConfirm} size="sm">
                verify
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                size="sm"
                className="dark:text-black"
              >
                Confirm
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}
