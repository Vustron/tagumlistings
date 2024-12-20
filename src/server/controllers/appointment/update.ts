// utils
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types

import type { UpdateAppointmentValues } from "@/lib/validation"
import type { Appointment } from "@/lib/types"
import type { NextRequest } from "next/server"

export async function updateAppointmentController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updateAppointmentBody =
      await requestBodyHandler<UpdateAppointmentValues>(request)

    const { id, user, date, description, color, status } = updateAppointmentBody

    const requiredFields: (keyof typeof updateAppointmentBody)[] = [
      "id",
      "user",
      "date",
      "description",
      "color",
      "status",
    ]

    const errorResponse = checkRequiredFields(
      updateAppointmentBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    if (description) {
      // Check if description is being changed
      const currentAppointment = await getDoc(
        doc(firestore, "appointments", id!),
      )
      const currentData = currentAppointment.data()

      if (currentData?.description !== description) {
        // Check for duplicate description
        const descriptionQuery = query(
          collection(firestore, "appointments"),
          where("description", "==", description),
        )

        const existingAppointments = await getDocs(descriptionQuery)

        if (!existingAppointments.empty) {
          return NextResponse.json(
            { error: "An appointment with this description already exists" },
            { status: 409 },
          )
        }
      }
    }

    const appointmentRef = doc(firestore, "appointments", id!)
    await updateDoc(appointmentRef, {
      user,
      date,
      description,
      color,
      status,
      updatedAt: serverTimestamp(),
    })

    const updatedAppointmentSnapshot = await getDoc(appointmentRef)
    const updatedAppointment = updatedAppointmentSnapshot.data() as Appointment

    return NextResponse.json(updatedAppointment, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
