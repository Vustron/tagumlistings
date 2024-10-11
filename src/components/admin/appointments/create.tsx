"use client"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import DynamicForm from "@/components/shared/dynamic-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// hooks
import { useDeleteAppointmentDate } from "@/lib/hooks/appointment/delete-date"
import { useSaveAppointment } from "@/lib/hooks/appointment/save-date"
import { useCreateAppointment } from "@/lib/hooks/appointment/create"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useForm } from "react-hook-form"

// utils
import { addAppointmentFields } from "@/lib/misc/field-configs"
import { clientErrorHandler, formatDate } from "@/lib/utils"
import { addAppointmentSchema } from "@/lib/validation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isValid, parseISO } from "date-fns"
import toast from "react-hot-toast"

// types
import type { Appointment, AppointmentDate, UserData } from "@/lib/types"
import type { AddAppointmentValues } from "@/lib/validation"

interface SetAppointmentDatesDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  setAvailableDates: (dates: Date[]) => void
  initialDates?: Date[]
  appointmentDates: AppointmentDate[]
  appointments: Appointment[]
}

const CreateAppointmentDialog = ({
  isOpen,
  onOpenChange,
  initialDates = [],
  appointmentDates,
  appointments,
}: SetAppointmentDatesDialogProps) => {
  const [activeTab, setActiveTab] = useState("set-dates")
  const [dates, setDates] = useState<string[]>(
    initialDates.map((date) => format(date, "yyyy-MM-dd'T'HH:mm")),
  )

  // Hooks
  const { data: accountsData } = useGetAccounts()
  const allAccounts = accountsData?.accounts ?? []

  // Correctly filter out accounts that already have appointments
  const availableAccounts = useMemo(() => {
    // Get the IDs of users who already have appointments
    const usersWithAppointments = appointments.map((apt) => apt.user)

    // Filter the accounts to only include those without appointments
    return allAccounts.filter(
      (account: UserData) => !usersWithAppointments.includes(account.id!),
    )
  }, [allAccounts, appointments])

  // Check if there are any available dates for appointments
  const hasAvailableDates = useMemo(
    () =>
      appointmentDates.some(
        (appointmentDate) => appointmentDate.dates.length > 0,
      ),
    [appointmentDates],
  )

  const saveAppointmentDateMutation = useSaveAppointment()
  const deleteAppointmentDateMutation = useDeleteAppointmentDate()
  const createAppointmentMutation = useCreateAppointment()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this appointment date",
  )

  // Form setup for new appointments
  const form = useForm<AddAppointmentValues>({
    resolver: zodResolver(addAppointmentSchema),
    defaultValues: {
      user: "",
      date: "",
      description: "",
      color: "",
    },
  })

  // Reset form when available accounts change
  useEffect(() => {
    const currentUser = form.getValues("user")
    if (
      currentUser &&
      !availableAccounts.find((acc) => acc.name === currentUser)
    ) {
      form.setValue("user", "")
    }
  }, [availableAccounts, form])

  // Date management handlers
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

  const handleSubmitDates = useCallback(async () => {
    const parsedDates = dates
      .filter((date) => date.trim() !== "")
      .map((date) => parseISO(date))
      .filter(isValid)

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
  }, [dates, saveAppointmentDateMutation])

  // New appointment handler with improved validation
  const handleSubmitAppointment = async (values: AddAppointmentValues) => {
    const isUserAvailable = availableAccounts.some(
      (account) => account.name === values.user,
    )
    if (!isUserAvailable) {
      toast.error("This user is not available for appointments")
      form.reset()
      return
    }

    await toast.promise(createAppointmentMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Adding appointment...</span>,
      success: "Appointment added",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm()
    if (ok) {
      await toast.promise(deleteAppointmentDateMutation.mutateAsync(id), {
        loading: "Deleting appointment date...",
        success: "Appointment date deleted",
        error: (error: unknown) => clientErrorHandler(error),
      })
    }
  }

  const isSubmitDisabled = useMemo(() => {
    return dates.every((date) => date.trim() === "")
  }, [dates])

  // Check if there are any available accounts for new appointments
  const hasAvailableAccounts = availableAccounts.length > 0

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Appointment Management
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="set-dates"
                className="flex items-center gap-2"
              >
                <Calendar size={16} />
                Set Available Dates
              </TabsTrigger>
              <TabsTrigger
                value="new-appointment"
                className="flex items-center gap-2"
                disabled={!hasAvailableDates || !hasAvailableAccounts}
              >
                {hasAvailableDates && hasAvailableAccounts ? (
                  <>
                    <Plus size={16} />
                    <span>New Appointment</span>
                  </>
                ) : (
                  <>
                    {!hasAvailableDates && " (No Available Dates)"}
                    {!hasAvailableAccounts && " (No Available Users)"}
                  </>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="set-dates">
              <ScrollArea className="max-h-[40vh] pr-4">
                <motion.div className="space-y-4">
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
                          onChange={(e) =>
                            handleDateChange(index, e.target.value)
                          }
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
                <Button
                  onClick={addDateField}
                  variant="outline"
                  className="w-full"
                >
                  Add Date
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSubmitDates}
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
                            <div
                              key={index}
                              className="text-sm dark:text-white"
                            >
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
            </TabsContent>

            <TabsContent value="new-appointment" className="space-y-4">
              {hasAvailableDates && hasAvailableAccounts ? (
                <FallbackBoundary>
                  <DynamicForm<AddAppointmentValues>
                    form={form}
                    onSubmit={handleSubmitAppointment}
                    fields={addAppointmentFields(
                      availableAccounts,
                      appointmentDates,
                      appointments,
                    )}
                    submitButtonTitle="Add Appointment"
                    submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
                    submitButtonTitleClassname="text-md font-medium"
                    mutation={createAppointmentMutation}
                  />
                </FallbackBoundary>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {!hasAvailableDates
                    ? "No dates available for new appointments. Please add available dates first."
                    : "All users already have appointments scheduled."}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateAppointmentDialog
