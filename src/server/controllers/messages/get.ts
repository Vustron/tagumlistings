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

export async function getMessageController(request: NextRequest) {
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

    const messageDocRef = doc(firestore, "messages", id)
    const messageSnapshot = await getDoc(messageDocRef)

    if (!messageSnapshot.exists()) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const data = messageSnapshot.data()
    const message = {
      id: messageSnapshot.id,
      ...data,
      created_at: data?.created_at
        ? convertTimestampToDateString(data.created_at)
        : null,
      updatedAt: data?.updatedAt
        ? convertTimestampToDateString(data.updatedAt)
        : null,
    }

    return NextResponse.json(message, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
