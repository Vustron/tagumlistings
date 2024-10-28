"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"

// actions
import { createMessage } from "@/lib/actions/messages/create"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Messages } from "@/lib/types"

export const useCreateMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-message"],
    mutationFn: async (values: AddMessageValues) => {
      return await createMessage(values)
    },
    onSuccess: async (newMessage) => {
      const queryFilter: QueryFilters = {
        queryKey: ["messages"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Messages>(["messages"], (oldData) => {
        if (!oldData) {
          return { messages: [newMessage] }
        }
        const messageExists = oldData.messages.some(
          (message) => message.id === newMessage.id,
        )
        if (messageExists) {
          return oldData
        }
        return {
          ...oldData,
          messages: [...oldData.messages, newMessage],
        }
      })
    },
    onSettled: () => {
      // router.push("/admin/messages")
      // router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
