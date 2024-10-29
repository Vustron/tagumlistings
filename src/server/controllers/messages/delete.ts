// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/server/helpers"
import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { NextResponse } from "next/server"

// configs
import { firestore, firebaseStorage } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// type
import type { NextRequest } from "next/server"
import type { Message } from "@/lib/types"

export async function deleteMessageControl(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const messageRef = doc(firestore, "messages", id)
    const messageSnapshot = await getDoc(messageRef)

    if (!messageSnapshot.exists()) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const messageData = messageSnapshot.data() as Message

    if (messageData.images && messageData.images.length > 0) {
      for (const pic of messageData.images) {
        const imageRef = ref(firebaseStorage, pic)
        await deleteObject(imageRef).catch((error) => {
          return NextResponse.json(
            { error: `Failed to delete image: ${pic}, ${error.message}` },
            { status: 400 },
          )
        })
      }
    }

    await deleteDoc(messageRef)

    return NextResponse.json(id, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
