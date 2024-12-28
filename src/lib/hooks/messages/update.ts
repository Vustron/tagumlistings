"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { updateMessage } from "@/lib/actions/messages/update"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { AddMessageValues } from "@/lib/validation"
import type { Messages } from "@/lib/types"

export const useUpdateMessage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["update-message"],
    mutationFn: async (values: AddMessageValues) => {
      return await updateMessage(values)
    },
    onSuccess: async (updatedMessage) => {
      const queryFilter: QueryFilters = {
        queryKey: ["messages"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Messages>(["messages"], (oldData) => {
        if (!oldData) {
          return { messages: [updatedMessage] }
        }
        const messageExists = oldData.messages.some(
          (message) => message.id === updatedMessage.id,
        )
        if (messageExists) {
          return {
            ...oldData,
            messages: oldData.messages.map((message) =>
              message.id === updatedMessage.id ? updatedMessage : message,
            ),
          }
        }
        return {
          ...oldData,
          messages: [...oldData.messages, updatedMessage],
        }
      })
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
