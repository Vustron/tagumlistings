// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import PropertiesClient from "@/components/agent/properties/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { propertiesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Properties",
}

export default async function PropertiesPage() {
  const [
    ,
    fetchAccount,
    fetchProperties,
    fetchAppointments,
    fetchAppointmentDates,
  ] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchProperties(),
    preFetchAppointments(),
    preFetchAppointmentDates(),
  ])
  return (
    <QueryHydrator
      prefetchFns={[
        fetchAccount,
        fetchProperties,
        fetchAppointments,
        fetchAppointmentDates,
      ]}
    >
      <ContentLayout title="Properties">
        <BounceWrapper>
          <DynamicBreadcrumb items={propertiesItems} />
          <PropertiesClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
