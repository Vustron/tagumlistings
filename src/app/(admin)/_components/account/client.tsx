"use client"

// components
import AccountForm from "@/app/(admin)/_components/account/form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// hooks
// import { useRouter } from "next/navigation"

const AccountClient = ({ id }: { id?: string }) => {
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
        <AccountForm id={id} />
      </div>
    </>
  )
}

export default AccountClient
