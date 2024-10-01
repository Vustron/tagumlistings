"use client"

// components
import NewPropertyForm from "@/components/admin/new-property/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
// import { useRouter } from "next/navigation"

const AddPropertyClient = () => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Add Property" description="Add new property" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <NewPropertyForm />
      </div>
    </>
  )
}

export default AddPropertyClient
