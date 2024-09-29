// utils
import {
  doc,
  getDoc,
  getDocs,
  writeBatch,
  collection,
} from "firebase/firestore"
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"
import type { DocumentData, QuerySnapshot } from "firebase/firestore"
import type { NextRequest } from "next/server"

export async function deletePaymentsController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { ids } = await requestBodyHandler<{ ids: string[] }>(request)

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 })
    }

    const batch = writeBatch(firestore)

    for (const id of ids) {
      const paymentRef = doc(firestore, "payments", id)
      const paymentSnap = await getDoc(paymentRef)

      if (paymentSnap.exists()) {
        batch.delete(paymentRef)
      }
    }

    await Promise.all([batch.commit()])

    const paymentsCollection = collection(firestore, "payments")
    const querySnapshot: QuerySnapshot<DocumentData> =
      await getDocs(paymentsCollection)
    const remainingPayments: Payment[] = []

    for (const doc of querySnapshot.docs) {
      remainingPayments.push({ id: doc.id, ...doc.data() } as Payment)
    }

    return NextResponse.json(
      {
        payments: remainingPayments,
      },
      { status: 200 },
    )
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
