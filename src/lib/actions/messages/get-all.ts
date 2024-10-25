// config
import { firestore } from "@/lib/config/firebase"

// utils
import { collection, onSnapshot } from "firebase/firestore"
import { clientErrorHandler } from "@/lib/utils"

// hooks
import { useQueryClient } from "@tanstack/react-query"

// types
import type { Message } from "@/lib/types"

export async function getMessages(): Promise<{ messages: Message[] }> {
  const messagesRef = collection(firestore, "messages")

  const queryClient = useQueryClient()
  return new Promise<{ messages: Message[] }>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        const messages: Message[] = []

        for (const doc of snapshot.docs) {
          const data = doc.data() as Message
          messages.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt ? data.createdAt.toString() : undefined,
            updatedAt: data.updatedAt ? data.updatedAt.toString() : undefined,
          })
        }

        messages.sort((a, b) =>
          (a.createdAt || "").localeCompare(b.createdAt || ""),
        )

        queryClient.setQueryData(["messages"], {
          messages: messages,
        })

        resolve({ messages })
      },
      (error: unknown) => {
        reject(clientErrorHandler(error))
      },
    )

    return () => unsubscribe()
  })
}
