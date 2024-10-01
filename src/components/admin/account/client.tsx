"use client"

// components
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import AccountForm from "@/components/admin/account/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAccount } from "@/lib/hooks/auth/get"

// utils
import { ErrorBoundary } from "react-error-boundary"
import { isValidSessionData } from "@/lib/utils"
import { dataSerializer } from "@/lib/utils"
import { Suspense } from "react"

// types
import type { UserData } from "@/lib/types"

const AccountClient = ({ id }: { id?: string }) => {
  const { data: user } = useGetAccount(id!)

  const userData: UserData | undefined =
    user && isValidSessionData(user)
      ? dataSerializer<UserData>(user)
      : undefined

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Current Account"
          description="Manage your account information"
        />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <AccountForm id={id} data={userData!} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

export default AccountClient
