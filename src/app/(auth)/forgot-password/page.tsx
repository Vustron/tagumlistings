// components
import ForgotPasswordClient from "@/components/auth/forgot-password/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Forgot Password",
}

export default function ForgotPasswordPage() {
  return (
    <main className="m-auto flex size-full flex-col items-center justify-center">
      <ForgotPasswordClient />
    </main>
  )
}
