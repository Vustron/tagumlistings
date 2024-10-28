// utils
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { convertAndCheckRateLimit, handleErrorResponse } from "@/server/helpers"
import { requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Message } from "@/lib/types"

export async function createMessageControl(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

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

    const messageData = {
      content,
      images,
      senderId,
      receiverId,
      createdAt: serverTimestamp(),
    }

    const messageRef = await addDoc(
      collection(firestore, "messages"),
      messageData,
    )

    const id = messageRef.id
    await updateDoc(doc(firestore, "messages", id), {
      ...messageData,
      id,
      updatedAt: serverTimestamp(),
    })

    const updatedMessage = await getDoc(doc(firestore, "messages", id))
    const message = updatedMessage.data() as Message

    return NextResponse.json(message, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
