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
import { useSaveAppointmentDate } from "@/lib/hooks/appointment/save-date"
import { useCreateAppointment } from "@/lib/hooks/appointment/create"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useSession } from "@/components/providers/session"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"

// utils
import { addAppointmentFields } from "@/lib/misc/field-configs"
import {
  clientErrorHandler,
  filterAvailableDates,
  formatDate,
} from "@/lib/utils"
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
  isOnClient?: boolean
  propertyId?: string
}

const CreateAppointmentDialog = ({
  isOpen,
  onOpenChange,
  initialDates = [],
  appointmentDates,
  appointments,
  isOnClient,
  propertyId,
}: SetAppointmentDatesDialogProps) => {
  const [activeTab, setActiveTab] = useState(
    isOnClient ? "new-appointment" : "set-dates",
  )
  const [dates, setDates] = useState<string[]>(
    initialDates.map((date) => format(date, "yyyy-MM-dd")),
  )
  const session = useSession()
  const { data: accountsData } = useGetAccounts()
  const allAccounts = accountsData?.accounts ?? []
  const router = useRouter()

  // Check if the current user already has an appointment for the given property
  const userHasAppointment = useMemo(() => {
    return appointments.some(
      (appointment) =>
        appointment.user === session.name &&
        appointment.propertyId === propertyId,
    )
  }, [appointments, session.name, propertyId])

  // Filter available accounts based on isOnClient and existing appointments
  const availableAccounts = useMemo(() => {
    if (isOnClient) {
      // For client view, only show agents
      return allAccounts.filter((account: UserData) => account.role === "agent")
    }

    if (session.role === "agent") {
      // For agent view, only show clients without appointments
      const usersWithAppointments = appointments.map((apt) => apt.user)
      return allAccounts.filter(
        (account: UserData) =>
          account.role === "client" &&
          !usersWithAppointments.includes(account.name),
      )
    }

    if (session.role === "admin") {
      // For admin view, show both clients and agents
      return allAccounts.filter(
        (account: UserData) =>
          account.role === "client" || account.role === "agent",
      )
    }

    return []
  }, [allAccounts, appointments, isOnClient, session.role])

  // Check if there are any available dates for appointments
  const hasAvailableDates = useMemo(() => {
    const filteredDates = filterAvailableDates(
      appointmentDates,
      appointments.filter((apt) => apt.propertyId === propertyId),
      propertyId,
    )
    return filteredDates.length > 0
  }, [appointmentDates, appointments, propertyId])

  const saveAppointmentDateMutation = useSaveAppointmentDate()
  const deleteAppointmentDateMutation = useDeleteAppointmentDate()
  const createAppointmentMutation = useCreateAppointment()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this appointment date",
  )

  const form = useForm<AddAppointmentValues>({
    resolver: zodResolver(addAppointmentSchema),
    defaultValues: {
      user: isOnClient ? session.name : "",
      agent: "",
      date: "",
      description: "",
      color: "",
      propertyId: propertyId,
    },
  })

  useEffect(() => {
    if (!isOnClient) {
      const currentUser = form.getValues("user")
      if (
        currentUser &&
        !availableAccounts.find((acc) => acc.id === currentUser)
      ) {
        form.setValue("user", "")
      }
    }
  }, [availableAccounts, form, isOnClient])

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
    const getDateWithoutTime = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const isCurrentOrFutureDate = (date: Date) => {
      const today = getDateWithoutTime(new Date())
      const dateToCheck = getDateWithoutTime(date)
      return dateToCheck >= today
    }

    const parsedDates = dates
      .filter((date) => date.trim() !== "")
      .map((date) => parseISO(date))
      .filter(isValid)
      .filter(isCurrentOrFutureDate)

    if (parsedDates.length === 0) {
      toast.error("Please select valid dates from today or future dates only.")
      return
    }

    const uniqueDates = parsedDates.filter((newDate) => {
      const newDateTimestamp = getDateWithoutTime(newDate).getTime()

      const isDuplicateInAppointmentDates = appointmentDates.some(
        (appointmentDate) =>
          appointmentDate.dates.some(
            (existingDate) =>
              getDateWithoutTime(new Date(existingDate)).getTime() ===
              newDateTimestamp,
          ),
      )

      const isDuplicateInAppointments = appointments.some(
        (appointment) =>
          getDateWithoutTime(new Date(appointment.date)).getTime() ===
          newDateTimestamp,
      )

      const isDuplicateInCurrentSelection = parsedDates
        .filter((d) => d !== newDate)
        .some((d) => getDateWithoutTime(d).getTime() === newDateTimestamp)

      return !(
        isDuplicateInAppointmentDates ||
        isDuplicateInAppointments ||
        isDuplicateInCurrentSelection
      )
    })

    if (uniqueDates.length === 0) {
      toast.error(
        "Selected dates are already taken or invalid. Please select different dates.",
      )
      return
    }

    await toast.promise(
      saveAppointmentDateMutation.mutateAsync({
        dates: uniqueDates,
        id: "",
      }),
      {
        loading: "Saving appointment dates...",
        success: "Appointment dates saved successfully",
        error: (error: unknown) => clientErrorHandler(error),
      },
    )

    setDates([])
  }, [dates, appointments, appointmentDates, saveAppointmentDateMutation])

  const handleSubmitAppointment = async (values: AddAppointmentValues) => {
    try {
      await createAppointmentMutation.mutateAsync(values)

      // Find and delete matching appointment date
      const matchingAppointmentDate = appointmentDates.find((appointmentDate) =>
        appointmentDate.dates.some((date) => {
          const appointmentDateWithoutTime = new Date(date)
          appointmentDateWithoutTime.setHours(0, 0, 0, 0)

          if (!values.date) return false
          const selectedDateWithoutTime = new Date(values.date)
          selectedDateWithoutTime.setHours(0, 0, 0, 0)

          return (
            appointmentDateWithoutTime.getTime() ===
            selectedDateWithoutTime.getTime()
          )
        }),
      )

      if (matchingAppointmentDate?.id) {
        await deleteAppointmentDateMutation.mutateAsync(
          matchingAppointmentDate.id,
        )
      }

      const selectedAgent = allAccounts.find(
        (account) => account.name === values.agent && account.role === "agent",
      )

      toast.success("Appointment created successfully")
      form.reset()
      onOpenChange(false)

      if (selectedAgent && isOnClient) {
        const encodedAgentId = encodeURIComponent(selectedAgent.id!)
        router.push(`/contact?agentId=${encodedAgentId}`)
      }
    } catch (error) {
      toast.error(clientErrorHandler(error))
    }
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
              Create Appointment
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
                disabled={
                  !hasAvailableDates || (!hasAvailableAccounts && !isOnClient)
                }
              >
                {hasAvailableDates && (hasAvailableAccounts || isOnClient) ? (
                  <>
                    <Plus size={16} />
                    <span>New Appointment</span>
                  </>
                ) : (
                  <>
                    {!hasAvailableDates && " (No Available Dates)"}
                    {!hasAvailableAccounts &&
                      !isOnClient &&
                      " (No Available Users)"}
                  </>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="set-dates">
              {userHasAppointment && isOnClient ? (
                <div className="text-center py-8 text-gray-500">
                  You already have an appointment scheduled for this property.
                  You cannot set more dates.
                </div>
              ) : (
                <>
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
                              type="date"
                              value={date}
                              min={format(new Date(), "yyyy-MM-dd")}
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
                          isSubmitDisabled ||
                          saveAppointmentDateMutation.isPending
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
                      {appointmentDates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No available dates.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filterAvailableDates(
                            appointmentDates,
                            appointments.filter(
                              (apt) => apt.propertyId === propertyId,
                            ),
                            propertyId,
                          ).map((appointmentDate) => (
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
                                onClick={() =>
                                  handleDelete(appointmentDate.id!)
                                }
                                disabled={
                                  deleteAppointmentDateMutation.isPending
                                }
                                variant="ghost"
                                size="icon"
                                className="hover:bg-transparent text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="new-appointment" className="space-y-4">
              {hasAvailableDates && (hasAvailableAccounts || isOnClient) ? (
                <FallbackBoundary>
                  {userHasAppointment && isOnClient ? (
                    <div className="text-center py-8 text-gray-500">
                      You already have an appointment scheduled for this
                      property. You cannot create more appointments.
                    </div>
                  ) : (
                    <DynamicForm<AddAppointmentValues>
                      form={form}
                      onSubmit={handleSubmitAppointment}
                      fields={addAppointmentFields(
                        availableAccounts,
                        appointmentDates,
                        appointments,
                        isOnClient!,
                      )}
                      submitButtonTitle={
                        isOnClient ? "Book Appointment" : "Add Appointment"
                      }
                      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
                      submitButtonTitleClassname="text-md font-medium"
                      mutation={createAppointmentMutation}
                    />
                  )}
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
