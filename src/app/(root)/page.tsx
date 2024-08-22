"use client"

// components
import SubmitButton from "@/components/shared/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// utils
import { httpRequest } from "@/lib/config/http"
import { clientErrorHandler, createUniqueId } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { RequestHelloWorld } from "@/lib/types"

export default function RootPage() {
  // example api hander
  const getHelloWorld = async () => {
    try {
      const data = await httpRequest<RequestHelloWorld>({
        url: "hello",
        method: "GET",
      })
      return { data }
    } catch (error) {
      return Promise.reject(clientErrorHandler(error))
    }
  }

  const handleGetHelloWorld = async () => {
    await toast.promise(getHelloWorld(), {
      loading: <span className="animate-pulse">Fetching...</span>,
      success: (result) => JSON.stringify(result.data.message),
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  return (
    <main className="m-auto flex size-full flex-col items-center justify-center">
      <h1 className="my-6 text-3xl font-bold">
        NextJS Template w/ Custom Toast, Shadcn-ui, and React Query
      </h1>

      <div className="flex flex-row items-center justify-center">
        <h3 className="mb-6 text-lg font-semibold">Made by Vustron</h3>
        <Avatar className="mb-6 ml-4">
          <AvatarImage src="/images/vustron.png" />
          <AvatarFallback>
            <h3 className="text-2xl font-semibold">Vustron</h3>
          </AvatarFallback>
        </Avatar>
      </div>

      <SubmitButton
        title="Click"
        onClick={handleGetHelloWorld}
        buttonClassName="hover:bg-blue-600"
      />

      <SubmitButton
        title="Random Id"
        onClick={() => console.log(createUniqueId())}
        buttonClassName="hover:bg-blue-600"
      />
    </main>
  )
}
