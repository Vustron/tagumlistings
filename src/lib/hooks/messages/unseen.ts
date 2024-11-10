import { collection, query, where, onSnapshot, and } from "firebase/firestore"
import { firestore } from "@/lib/config/firebase"

import { useState, useEffect } from "react"

import type { Message } from "@/lib/types"

export const useUnseenMessages = (userId?: string) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!userId) return

    const messagesRef = collection(firestore, "messages")
    const q = query(
      messagesRef,
      and(where("receiverId", "==", userId), where("seen", "==", false)),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[]
      setUnseenMessages(messages)
    })

    return () => unsubscribe()
  }, [userId])

  return unseenMessages
}
