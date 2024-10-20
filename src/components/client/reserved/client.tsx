"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/client/reserved/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useSession } from "@/components/providers/session"
import { useGetAccount } from "@/lib/hooks/auth/get"
import { useRef } from "react"

// utils
import { isValidSessionData } from "@/lib/utils"
import { dataSerializer } from "@/lib/utils"

// types
import type { UserData } from "@/lib/types"
import type { ElementRef } from "react"

const ReservedPropertiesClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data } = useGetProperties()
  const session = useSession()
  const { data: user } = useGetAccount(session.id!)

  const userData: UserData | undefined =
    user && isValidSessionData(user)
      ? dataSerializer<UserData>(user)
      : undefined

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const reservedPropertyIds =
    userData?.reservedProperties?.map((prop) => prop.id) || []
  const reservedProperties =
    data?.properties?.filter((prop) => reservedPropertyIds.includes(prop.id)) ||
    []
  const propertyCount = reservedProperties.length

  return (
    <FallbackBoundary>
      <div className="container p-10">
        <div className="flex items-start justify-between">
          <Heading
            title={`Reserved Properties (${propertyCount})`}
            description="Manage reserved properties"
          />
        </div>
        <Separator className="mt-2" />
        <div ref={topRef}>
          <DataTable
            placeholder="Search..."
            columns={columns}
            isOnProperties
            data={reservedProperties}
            noBulkDelete
            isOnClient
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </FallbackBoundary>
  )
}

export default ReservedPropertiesClient
