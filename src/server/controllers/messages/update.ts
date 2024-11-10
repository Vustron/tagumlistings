// utils
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
// import type { Message } from "@/lib/types"

export async function updateMessageControl(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updateMessageBody =
      await requestBodyHandler<AddMessageValues>(request)

    const { id, content, images, senderId, receiverId } = updateMessageBody

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 },
      )
    }

    const messageData = {
      id,
      content,
      images,
      senderId,
      receiverId,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(doc(firestore, "messages", id), messageData)

    // const id = messageRef.id
    // await updateDoc(doc(firestore, "messages", id), {
    //   ...messageData,
    //   id,
    //   updatedAt: serverTimestamp(),
    // })

    // const updatedMessage = await getDoc(doc(firestore, "messages", id))
    // const message = updatedMessage.data() as Message

    return NextResponse.json(messageData, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
