"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { getAppointments } from "@/lib/actions/appointment/get-all"
import { getProperty } from "@/lib/actions/property/get"

import { placeholderImage } from "@/lib/utils"

import type { Appointment } from "@/lib/types"

export const useQueryClientPropertyData = (id: string, userName?: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["client-property-data", id],
    queryFn: async () => {
      const [property, appointments, appointmentDates] = await Promise.all([
        getProperty(id),
        getAppointments(),
        getAppointmentDates(),
      ])
      return { property, appointments, appointmentDates }
    },
  })

  const property = data?.property
  const filteredAppointments =
    data?.appointments?.appointments.filter(
      (appointment: Appointment) => appointment.user === userName,
    ) ?? []
  const dates = data?.appointmentDates?.dates ?? []
  const images = property?.propertyPics?.length
    ? property.propertyPics
    : [{ url: placeholderImage("No Images Available") }]

  return {
    property,
    filteredAppointments,
    appointmentDates: dates,
    images,
  }
}
