// utils
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddPaymentValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Payment } from "@/lib/types"

export async function createPaymentController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createPaymentBody =
      await requestBodyHandler<AddPaymentValues>(request)

    const { property, user, appointment, amount, paid_date } = createPaymentBody

    const requiredFields: (keyof typeof createPaymentBody)[] = [
      "property",
      "user",
      "appointment",
      "amount",
      "paid_date",
    ]

    const errorResponse = checkRequiredFields(createPaymentBody, requiredFields)

    if (errorResponse) return errorResponse

    const paymentData = {
      property,
      user,
      appointment,
      amount,
      paid_date,
      status: "pending",
      created_at: serverTimestamp(),
    }

    const paymentRef = await addDoc(
      collection(firestore, "payments"),
      paymentData,
    )

    const id = paymentRef.id
    await updateDoc(doc(firestore, "payments", id), {
      ...paymentData,
      id,
      updatedAt: serverTimestamp(),
    })

    const updatedAppointment = await getDoc(doc(firestore, "payments", id))
    const payment = updatedAppointment.data() as Payment

    return NextResponse.json(payment, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
