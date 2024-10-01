// utils
import { convertTimestampToDateString } from "@/lib/utils"
import { handleErrorResponse } from "@/lib/helpers"
import { doc, getDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { NextRequest } from "next/server"

export async function getAppointmentController(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const appointmentDocRef = doc(firestore, "appointments", id)
    const appointmentSnapshot = await getDoc(appointmentDocRef)

    if (!appointmentSnapshot.exists()) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      )
    }

    const data = appointmentSnapshot.data()
    const appointment = {
      id: appointmentSnapshot.id,
      ...data,
      created_at: data?.created_at
        ? convertTimestampToDateString(data.created_at)
        : null,
      updatedAt: data?.updatedAt
        ? convertTimestampToDateString(data.updatedAt)
        : null,
    }

    return NextResponse.json(appointment, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
