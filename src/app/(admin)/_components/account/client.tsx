"use client"

// components
import AccountForm from "@/app/(admin)/_components/account/form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// hooks
import { useGetAccount } from "@/app/(auth)/_hooks/use-get-account"
// import { useRouter } from "next/navigation"

// utils
import { dataSerializer } from "@/lib/utils"

// types
import type { SessionData } from "@/lib/config/session"
import { Loader2 } from "lucide-react"

const AccountClient = ({ id }: { id?: string }) => {
  const { data: user, isLoading, error, status } = useGetAccount(id)

  // stringify and parse user data
  const userData: SessionData | undefined = user
    ? dataSerializer(user)
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
        {isLoading ? (
          <Loader2 className="animate-spin size-6" />
        ) : status === "error" ? (
          <span className="absolute inset-0 flex items-center justify-center">
            {error?.message}
          </span>
        ) : (
          status === "success" &&
          userData && <AccountForm id={id} data={userData} />
        )}
      </div>
    </>
  )
}

export default AccountClient
