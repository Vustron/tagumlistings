"use client"

// components
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import ForgotPasswordForm from "@/components/auth/forgot-password/form"

const ForgotPasswordClient = () => {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Please check your email</CardTitle>
          <CardDescription>
            We’ve sent a code to your verified email to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-y-4">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordClient
