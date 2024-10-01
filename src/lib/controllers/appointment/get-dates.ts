// utils
import { convertTimestampToDateString } from "@/lib/utils"
import { getDocs, collection } from "firebase/firestore"
import { handleErrorResponse } from "@/lib/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

export async function getAppointmentDatesController() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const appointmentDatesCollection = collection(
      firestore,
      "appointment_dates",
    )
    const appointmentDatesSnapshot = await getDocs(appointmentDatesCollection)

    const appointmentDates = appointmentDatesSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at
          ? convertTimestampToDateString(data.created_at)
          : null,
        updatedAt: data.updatedAt
          ? convertTimestampToDateString(data.updatedAt)
          : null,
      }
    })

    return NextResponse.json({ dates: appointmentDates }, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
