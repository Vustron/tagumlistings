"use client"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getMessages } from "@/lib/actions/messages/get-all"

// hooks
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

// utils
import { collection, onSnapshot } from "firebase/firestore"
import { queryOptions } from "@tanstack/react-query"
import { clientErrorHandler } from "@/lib/utils"

// types
import type { Message, Messages } from "@/lib/types"

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
                createdAt: data.createdAt ? data.createdAt : undefined,
                updatedAt: data.updatedAt ? data.updatedAt : undefined,
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
