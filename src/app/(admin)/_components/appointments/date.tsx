"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

// hooks
import { useDeleteAppointmentDate } from "@/app/(admin)/_hooks/appointment/delete-date"
import { useSaveAppointment } from "@/app/(admin)/_hooks/appointment/save-date"
import { useState, useCallback, useMemo } from "react"
import { useConfirm } from "@/lib/hooks/use-confirm"

// utils
import { format, addDays, isValid, parseISO } from "date-fns"
import { clientErrorHandler, formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

// types

export interface AppointmentDate {
  id?: string | undefined
  dates: Date[]
}

interface SetAppointmentDatesDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  setAvailableDates: (dates: Date[]) => void
  initialDates?: Date[]
  appointmentDates: AppointmentDate[]
}

const SetAppointmentDatesDialog = ({
  isOpen,
  onOpenChange,
  initialDates = [],
  appointmentDates,
}: SetAppointmentDatesDialogProps) => {
  const [dates, setDates] = useState<string[]>(
    initialDates.map((date) => format(date, "yyyy-MM-dd'T'HH:mm")),
  )
  const [repeatWeekly] = useState(false)
  const [numberOfWeeks] = useState(1)

  const saveAppointmentDateMutation = useSaveAppointment()
  const deleteAppointmentDateMutation = useDeleteAppointmentDate()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this appointment date",
  )

  const handleDateChange = useCallback((index: number, value: string) => {
    setDates((prevDates) => {
      const newDates = [...prevDates]
      newDates[index] = value
      return newDates
    })
  }, [])

  const addDateField = useCallback(() => {
    setDates((prevDates) => [...prevDates, ""])
  }, [])

  const removeDateField = useCallback((index: number) => {
    setDates((prevDates) => prevDates.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(async () => {
    const parsedDates = dates
      .filter((date) => date.trim() !== "")
      .flatMap((date) => {
        const parsedDate = parseISO(date)
        if (!isValid(parsedDate)) return []

        if (repeatWeekly) {
          return Array.from({ length: numberOfWeeks }, (_, i) =>
            addDays(parsedDate, i * 7),
          )
        }
        return [parsedDate]
      })

    toast.promise(
      saveAppointmentDateMutation.mutateAsync({
        dates: parsedDates,
        id: "",
      }),
      {
        loading: "Saving appointment dates...",
        success: "Appointment dates saved successfully",
        error: (error: unknown) => clientErrorHandler(error),
      },
    )

    setDates([])
    onOpenChange(false)
  }, [
    dates,
    repeatWeekly,
    numberOfWeeks,
    saveAppointmentDateMutation,
    onOpenChange,
  ])

  const isSubmitDisabled = useMemo(() => {
    return dates.every((date) => date.trim() === "")
  }, [dates])

  const handleDelete = async (id: string) => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteAppointmentDateMutation.mutateAsync(id), {
        loading: (
          <span className="animate-pulse">Deleting appointment date...</span>
        ),
        success: "Appointment date deleted",
        error: (error: unknown) => clientErrorHandler(error),
      })
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Set Available Appointment Dates
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[40vh] pr-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <AnimatePresence>
                {dates.map((date, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      className="w-full"
                    />
                    <Button
                      onClick={() => removeDateField(index)}
                      variant="destructive"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
          <div className="space-y-4 mt-4">
            <Button onClick={addDateField} variant="outline" className="w-full">
              Add Date
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitDisabled || saveAppointmentDateMutation.isPending
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {saveAppointmentDateMutation.isPending
                  ? "Saving..."
                  : "Set Dates"}
              </Button>
            </motion.div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">
              Available Appointment Dates
            </h3>
            <ScrollArea className="h-[30vh]">
              <div className="space-y-2">
                {appointmentDates.map((appointmentDate) => (
                  <motion.div
                    key={appointmentDate.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-gray-100 dark:bg-background p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      {appointmentDate.dates.map((date, index) => (
                        <div key={index} className="text-sm dark:text-white">
                          {formatDate(date)}
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleDelete(appointmentDate.id!)}
                      disabled={deleteAppointmentDateMutation.isPending}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SetAppointmentDatesDialog
