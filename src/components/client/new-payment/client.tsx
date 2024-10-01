"use client"

// components
import NewPropertyForm from "@/components/admin/new-property/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
// import { useRouter } from "next/navigation"

const AddPaymentClient = () => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Add Payment" description="Add new payment" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        {/* // TODO: add new payment form */}
        <NewPropertyForm />
      </div>
    </>
  )
}

export default AddPaymentClient
