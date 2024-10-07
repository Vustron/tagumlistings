// utils
import { convertTimestampToDateString } from "@/lib/utils"
import { getDocs, collection } from "firebase/firestore"
import { handleErrorResponse } from "@/server/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

export async function getPaymentsController() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const paymentsCollection = collection(firestore, "payments")
    const paymentsSnapshot = await getDocs(paymentsCollection)

    const payments = paymentsSnapshot.docs.map((doc) => {
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

    return NextResponse.json({ payments: payments }, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
