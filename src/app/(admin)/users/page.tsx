// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import UsersClient from "@/app/(admin)/users/_components/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

import { users } from "@/app/(admin)/users/constants"
// utils
import { usersItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Users",
}

export default function UsersPage() {
  return (
    <ContentLayout title="Users">
      {/* breadcrumb */}
      <DynamicBreadcrumb items={usersItems} />

      {/* client */}
      <UsersClient data={users} />
    </ContentLayout>
  )
}
