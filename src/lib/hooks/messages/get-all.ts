"use client"

// hooks
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

// configs

// types
import type { Message, Messages } from "@/lib/types"
import { firestore } from "@/lib/config/firebase"
import { clientErrorHandler } from "@/lib/utils"
import { collection, onSnapshot } from "firebase/firestore"
import { getMessages } from "@/lib/actions/messages/get-all"

export const useGetMessages = () => {
  return useSuspenseQuery({
    queryKey: ["messages"],
    queryFn: () =>
      new Promise<{ messages: Message[] }>((resolve, reject) => {
        const messagesRef = collection(firestore, "messages")

        const queryClient = useQueryClient()
        const unsubscribe = onSnapshot(
          messagesRef,
          (snapshot) => {
            const messages: Message[] = []

            for (const doc of snapshot.docs) {
              const data = doc.data() as Message
              ;(messages as Message[]).push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt
                  ? data.createdAt.toString()
                  : undefined,
                updatedAt: data.updatedAt
                  ? data.updatedAt.toString()
                  : undefined,
              })
            }

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
      }),
  })
}

export async function preFetchMessages() {
  return queryOptions<Messages, Error>({
    queryKey: ["messages"],
    queryFn: async () => await getMessages(),
  })
}
