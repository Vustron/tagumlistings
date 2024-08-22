"use client"

// utils
import { ErrorHandler } from "@/lib/utils"
import Link from "next/link"
import { useEffect } from "react"

// types
import type { ErrorResponseData } from "@/lib/types"

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // init error handler
    const { message }: ErrorResponseData = ErrorHandler.handleError(error)

    // log error
    console.error(message)
  }, [error])

  return (
    <html lang="en">
      <body className="size-full">
        <section className="flex min-h-[100vh] flex-col items-center justify-center">
          <h1 className="max-w-md scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Something went wrong. 🤔
          </h1>

          <p className="font-md mt-[50px] animate-pulse text-center text-xl text-red-600">
            {error.message}
          </p>

          <Link href="/">
            <p className="mt-[50px] font-md hover:text-slate-700 animate-pulse text-center text-xl">
              Go back
            </p>
          </Link>
        </section>
      </body>
    </html>
  )
}
