"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import AccountForm from "@/components/admin/account/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAccount } from "@/lib/hooks/auth/get"

// utils
import { isValidSessionData } from "@/lib/utils"
import { dataSerializer } from "@/lib/utils"

// types
import type { UserData } from "@/lib/types"

const AccountClient = ({ id }: { id?: string }) => {
  const { data: user } = useGetAccount(id!)

  const userData: UserData | undefined =
    user && isValidSessionData(user)
      ? dataSerializer<UserData>(user)
      : undefined

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading
          title="Current Account"
          description="Manage your account information"
        />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <AccountForm id={id} data={userData!} />
      </div>
    </FallbackBoundary>
  )
}

export default AccountClient
