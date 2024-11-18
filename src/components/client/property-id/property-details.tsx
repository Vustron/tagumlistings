"use client"

// components
import {
  Bath,
  Clock,
  Square,
  Calendar,
  BedDouble,
  MapPinHouse,
} from "lucide-react"
import PropertyMetric from "@/components/client/property-id/property-metric"
import CreateAppointmentDialog from "@/components/admin/appointments/create"
import ImageCarousel from "@/components/client/property-id/image-carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// utils
import {
  formatDateLocal,
  formatPriceToPHP,
  getRoleBadgeColor,
} from "@/lib/utils"
import { motion } from "framer-motion"

// hooks
import { useState } from "react"

// types
import type { Appointment, AppointmentDate, Property } from "@/lib/types"

interface PropertyDetailsProps {
  property: Property
  images: { url: string }[]
  handleReserve?: () => void
  reservationStatus: "idle" | "success" | "error" | "pending"
  updateAccount: any
  isPropertyReserved: boolean
  appointments?: Appointment[]
  appointmentDates?: AppointmentDate[]
  isOnClientAppointments?: boolean
}

const PropertyDetails = ({
  property,
  images,
  reservationStatus,
  updateAccount,
  isPropertyReserved,
  appointments,
  appointmentDates,
  isOnClientAppointments,
}: PropertyDetailsProps) => {
  const [createAppointmentDialogOpen, setIsCreateAppointmentDialogOpen] =
    useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  const setAppointmentDates = (dates: Date[]) => {
    setAvailableDates(dates)
    setIsCreateAppointmentDialogOpen(false)
  }

  const hasBookedAppointment = appointments?.some(
    (appointment) => appointment.propertyId === property.id,
  )

  return (
    <>
      <CreateAppointmentDialog
        isOpen={createAppointmentDialogOpen}
        onOpenChange={setIsCreateAppointmentDialogOpen}
        setAvailableDates={setAppointmentDates}
        initialDates={availableDates}
        appointments={appointments!}
        appointmentDates={appointmentDates!}
        isOnClient={isOnClientAppointments}
        propertyId={property.id}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              Property Details
            </motion.h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                className={`${getRoleBadgeColor(property.status || "Unavailable")} text-sm`}
              >
                {property.status || "Unavailable"}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ID: {property.id}
              </span>
            </div>
          </div>
          {!hasBookedAppointment && (
            <Button
              onClick={() => setIsCreateAppointmentDialogOpen(true)}
              disabled={
                property.status !== "available" ||
                updateAccount.isPending ||
                reservationStatus === "success" ||
                isPropertyReserved
              }
              className="dark:hover:bg-green-400 bg-green-600 dark:bg-green-600 text-white"
            >
              {updateAccount.isPending
                ? "Processing..."
                : reservationStatus === "success" || isPropertyReserved
                  ? "Appointment sent"
                  : "Book appointment"}
            </Button>
          )}
        </div>

        <Card className="overflow-hidden bg-white dark:bg-zinc-800 shadow-lg rounded-xl">
          <ImageCarousel
            images={images}
            aspectRatio="video"
            showThumbnails={true}
            autoPlay={true}
            interval={5000}
          />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Property Information
                </h2>

                <div className="space-y-3">
                  <PropertyMetric
                    icon={BedDouble}
                    label="Bedrooms"
                    value={property.no_of_bedrooms}
                  />
                  <PropertyMetric
                    icon={Bath}
                    label="Bathrooms"
                    value={property.no_of_bathrooms}
                  />
                  <PropertyMetric
                    icon={Square}
                    label="Area"
                    value={`${property.square_meter} m²`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Location & Timing
                </h2>

                <div className="space-y-3">
                  <PropertyMetric
                    icon={MapPinHouse}
                    label="Location"
                    value={property.location}
                  />

                  <PropertyMetric
                    icon={Calendar}
                    label="Listed on"
                    value={formatDateLocal(property.created_at)}
                  />

                  <PropertyMetric
                    icon={Clock}
                    label="Last updated"
                    value={formatDateLocal(property.updated_at)}
                  />
                </div>
              </div>
            </div>

            {property.appointment_id && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  This property has an active appointment
                </p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Reservation Fee
              </h2>
              <p className="text-lg font-bold text-black dark:text-white">
                {formatPriceToPHP(property.price || "0")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

export default PropertyDetails
