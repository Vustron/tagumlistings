// components
import NewPasswordClient from "@/components/auth/new-password/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "New Password",
}

export default function NewPasswordPage() {
  return (
    <main className="m-auto flex size-full flex-col items-center justify-center">
      <NewPasswordClient />
    </main>
  )
}
