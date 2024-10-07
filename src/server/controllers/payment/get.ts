// utils
import { convertTimestampToDateString } from "@/lib/utils"
import { handleErrorResponse } from "@/server/helpers"
import { doc, getDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { NextRequest } from "next/server"

export async function getPaymentController(request: NextRequest) {
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

    const paymentDocRef = doc(firestore, "payments", id)
    const paymentSnapshot = await getDoc(paymentDocRef)

    if (!paymentSnapshot.exists()) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const data = paymentSnapshot.data()
    const payment = {
      id: paymentSnapshot.id,
      ...data,
      created_at: data?.created_at
        ? convertTimestampToDateString(data.created_at)
        : null,
      updatedAt: data?.updatedAt
        ? convertTimestampToDateString(data.updatedAt)
        : null,
    }

    return NextResponse.json(payment, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
