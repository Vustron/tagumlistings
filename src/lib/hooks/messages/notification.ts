// utils
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { firestore } from "@/lib/config/firebase"

// hooks
import { useState } from "react"

// types
import type { Message } from "@/lib/types"

export function useMessageNotifications(userId: string) {
  const [unseenCount, setUnseenCount] = useState(0)
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  const startListening = () => {
    const q = query(
      collection(firestore, "messages"),
      where("receiverId", "==", userId),
      where("seen", "==", false),
    )

    return onSnapshot(q, (snapshot) => {
      setUnseenCount(snapshot.size)
      setUnseenMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message),
      )
    })
  }

  return {
    unseenCount,
    unseenMessages,
    startListening,
  }
}
