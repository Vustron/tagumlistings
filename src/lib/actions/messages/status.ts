import { doc, writeBatch } from "firebase/firestore"
import { firestore } from "@/lib/config/firebase"

import type { Message } from "@/lib/types"

export const updateMessagesSeenStatus = async (messages: Message[]) => {
  const batch = writeBatch(firestore)

  for (const message of messages) {
    const messageRef = doc(firestore, "messages", message.id!)
    batch.update(messageRef, { seen: true })
  }

  await batch.commit()
}
