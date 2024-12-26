"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getMessage } from "@/lib/actions/messages/get"

export const useGetMessage = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["message", id],
    queryFn: () => getMessage(id),
  })

  return {
    message: data,
  }
}
