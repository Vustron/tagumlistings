"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"

// actions
import { createMessage } from "@/lib/actions/messages/create"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { createMessageSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Messages } from "@/lib/types"

const purify = DOMPurify

export const useCreateMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-message"],
    mutationFn: async (values: AddMessageValues) => {
      const sanitizedData = sanitizer<AddMessageValues>(
        values,
        createMessageSchema,
        purify,
      )
      return await createMessage(sanitizedData)
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
