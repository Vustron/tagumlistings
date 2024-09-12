// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import UsersClient from "@/app/(admin)/_components/users/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { users } from "@/app/(admin)/_components/data/users"
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
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={usersItems} />

        {/* client */}
        <UsersClient data={users} />
      </BounceWrapper>
    </ContentLayout>
  )
}
