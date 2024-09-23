// utils
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore"
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import * as getSession from "@/app/(auth)/_actions/session/get"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import type { AddAppointmentValues } from "@/lib/validation"
import type { NextRequest } from "next/server"

export async function createAppointmentController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession.getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createAppointmentBody =
      await requestBodyHandler<AddAppointmentValues>(request)

    const { user, date, description, color } = createAppointmentBody

    const requiredFields: (keyof typeof createAppointmentBody)[] = [
      "user",
      "date",
      "description",
      "color",
    ]

    const errorResponse = checkRequiredFields(
      createAppointmentBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    const appointmentData = {
      user,
      date,
      description,
      color,
      created_at: serverTimestamp(),
    }

    const appointmentRef = await addDoc(
      collection(firestore, "appointments"),
      appointmentData,
    )

    const id = appointmentRef.id
    await updateDoc(doc(firestore, "appointments", id), {
      ...appointmentData,
      id,
      updatedAt: serverTimestamp(),
    })

    const updatedAppointment = await getDoc(doc(firestore, "appointments", id))
    const property = updatedAppointment.data() as Appointment

    return NextResponse.json(property, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
