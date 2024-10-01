// utils
import {
  doc,
  query,
  where,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddAppointmentDateValues } from "@/lib/validation"
import type { AppointmentDate } from "@/lib/types"
import type { NextRequest } from "next/server"

export async function saveAppointmentDateController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createPropertyBody =
      await requestBodyHandler<AddAppointmentDateValues>(request)

    const { dates } = createPropertyBody

    const requiredFields: (keyof typeof createPropertyBody)[] = ["dates"]

    const errorResponse = checkRequiredFields(
      createPropertyBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    const existingDatesQuery = query(
      collection(firestore, "appointment_dates"),
      where("dates", "array-contains-any", dates),
    )
    const existingDatesSnapshot = await getDocs(existingDatesQuery)

    if (!existingDatesSnapshot.empty) {
      const existingDates = existingDatesSnapshot.docs.flatMap(
        (doc) => doc.data().dates,
      )
      const overlappingDates = dates.filter((date) =>
        existingDates.includes(date),
      )

      if (overlappingDates.length > 0) {
        return NextResponse.json(
          { error: "One or more of the dates already exist", overlappingDates },
          { status: 400 },
        )
      }
    }

    const propertyData = {
      dates,
      created_at: serverTimestamp(),
    }

    const appointmentDateRef = await addDoc(
      collection(firestore, "appointment_dates"),
      propertyData,
    )

    const id = appointmentDateRef.id
    await updateDoc(doc(firestore, "appointment_dates", id), {
      ...propertyData,
      id,
      updatedAt: serverTimestamp(),
    })

    const updatedAppointmentDates = await getDoc(
      doc(firestore, "appointment_dates", id),
    )
    const appointmentDate = updatedAppointmentDates.data() as AppointmentDate

    return NextResponse.json(appointmentDate, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
