// utils
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { firestore } from "@/lib/config/firebase"

// hooks
import { useCallback, useEffect, useState } from "react"

// types
import type { Message } from "@/lib/types"



export function useMessageNotifications(userId: string) {
  const [ unseenMessages, setUnseenMessages ] = useState<Message[]>([])
  const [ unseenCount, setUnseenCount ] = useState(0)

  const startListening = useCallback(() => {
    if (!userId) return

    const messagesRef = collection(firestore, 'messages')
    const unseenQuery = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('seen', '==', false)
    )

    const unsubscribe = onSnapshot(unseenQuery, (snapshot) => {
      const messages: Message[] = []
      for (const doc of snapshot.docs) {
        messages.push({ id: doc.id, ...doc.data() } as Message)
      }
      setUnseenMessages(messages)
      setUnseenCount(messages.length)
    })

    return unsubscribe
  }, [ userId ])

  useEffect(() => {
    const unsubscribe = startListening()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [ startListening ])

  return {
    unseenMessages,
    unseenCount,
    startListening
  }
}
