// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { UpdatePaymentValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Payment } from "@/lib/types"

export async function updatePaymentController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updatePaymentBody =
      await requestBodyHandler<UpdatePaymentValues>(request)

    const { id, property, user, appointment, amount, paid_date } =
      updatePaymentBody

    const requiredFields: (keyof typeof updatePaymentBody)[] = [
      "id",
      "property",
      "user",
      "appointment",
      "amount",
      "paid_date",
    ]

    const errorResponse = checkRequiredFields(updatePaymentBody, requiredFields)

    if (errorResponse) return errorResponse

    const paymentRef = doc(firestore, "payments", id!)
    await updateDoc(paymentRef, {
      property,
      user,
      appointment,
      amount,
      paid_date,
      updatedAt: serverTimestamp(),
    })

    const updatedPaymentSnapshot = await getDoc(paymentRef)
    const updatedPayment = updatedPaymentSnapshot.data() as Payment

    return NextResponse.json(updatedPayment, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
