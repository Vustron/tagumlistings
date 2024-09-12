"use client"

// components
import NewPropertyForm from "@/app/(admin)/admin/properties/new/_components/new-property-form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

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
