"use client"

// components
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import NewPasswordForm from "@/components/auth/new-password/form"

const NewPasswordClient = () => {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Enter your new password</CardTitle>
          <CardDescription>
            Please enter a new password to reset the password of your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-y-4">
          <NewPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default NewPasswordClient
