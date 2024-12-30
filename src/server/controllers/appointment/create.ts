// utils
import {
  doc,
  getDoc,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  collection,
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
import type { AddAppointmentValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Appointment } from "@/lib/types"

export async function createAppointmentController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createAppointmentBody =
      await requestBodyHandler<AddAppointmentValues>(request)

    const { user, agent, date, description, color, propertyId } =
      createAppointmentBody

    const requiredFields: (keyof typeof createAppointmentBody)[] = [
      "user",
      "agent",
      "date",
      "description",
      "color",
    ]

    const errorResponse = checkRequiredFields(
      createAppointmentBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

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

    const appointmentData = {
      user,
      agent,
      date,
      description,
      color,
      status: "pending",
      propertyId,
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
