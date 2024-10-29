"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"

// actions
import { deleteMessage } from "@/lib/actions/messages/delete"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { Messages } from "@/lib/types"

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-message"],
    mutationFn: async (id: string) => {
      return await deleteMessage(id)
    },
    onSuccess: async (deletedMessage) => {
      const queryFilter: QueryFilters = {
        queryKey: ["messages"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Messages>(["messages"], (oldData) => {
        if (!oldData) {
          return { messages: [] }
        }
        return {
          ...oldData,
          messages: oldData.messages.filter(
            (message) => message.id !== deletedMessage.id,
          ),
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
