// utils
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// type
import type { NextRequest } from "next/server"
import type { Appointment } from "@/lib/types"

export async function deleteAppointmentController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    // Get appointment to find propertyId
    const appointmentRef = doc(firestore, "appointments", id)
    const appointmentSnap = await getDoc(appointmentRef)
    if (!appointmentSnap.exists()) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      )
    }

    const appointment = appointmentSnap.data() as Appointment
    if (appointment.propertyId) {
      // Update property to remove appointment_id
      const propertyRef = doc(firestore, "properties", appointment.propertyId)
      await updateDoc(propertyRef, {
        appointment_id: null,
      })
    }

    // Delete appointment
    await deleteDoc(appointmentRef)

    return NextResponse.json(id, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
