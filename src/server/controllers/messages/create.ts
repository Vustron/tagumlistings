// utils
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { createUniqueId, requestBodyHandler } from "@/lib/utils"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
// import type { Message } from "@/lib/types"

export async function createMessageControl(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createMessageBody =
      await requestBodyHandler<AddMessageValues>(request)

    const { content, images, senderId, receiverId } = createMessageBody

    const messageId = createUniqueId()

    const messageData = {
      id: messageId,
      content,
      images,
      senderId,
      receiverId,
      seen: false,
      createdAt: serverTimestamp(),
    }

    await setDoc(doc(firestore, "messages", messageId), messageData)

    return NextResponse.json(messageData, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
