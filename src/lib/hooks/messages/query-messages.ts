"use client"

import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query"

import { collection, onSnapshot } from "firebase/firestore"
import { getAccounts } from "@/lib/actions/auth/get-all"
import { firestore } from "@/lib/config/firebase"

import { clientErrorHandler } from "@/lib/utils"

import type { Message, Accounts } from "@/lib/types"

export const useQueryMessagesData = () => {
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery({
    queryKey: ["messages-data"],
    queryFn: () =>
      getAccounts()
        .then((accounts) => {
          return new Promise<{ accounts: Accounts; messages: Message[] }>(
            (resolve, reject) => {
              const messagesRef = collection(firestore, "messages")
              const unsubscribe = onSnapshot(
                messagesRef,
                (snapshot) => {
                  const messages: Message[] = []

                  for (const doc of snapshot.docs) {
                    const data = doc.data() as Message
                    messages.push({
                      ...data,
                      id: doc.id,
                      createdAt: data.createdAt ?? new Date().toISOString(),
                      updatedAt: data.updatedAt ? data.updatedAt : undefined,
                    })
                  }

                  queryClient.setQueryData(["messages-data"], {
                    accounts,
                    messages,
                  })

                  resolve({ accounts, messages })
                },
                (error: unknown) => {
                  reject(clientErrorHandler(error))
                },
              )

              return () => unsubscribe()
            },
          )
        })
        .catch((error) => {
          throw clientErrorHandler(error)
        }),
  })

  return {
    accounts: data?.accounts?.accounts ?? [],
    messages: data?.messages ?? [],
  }
}
