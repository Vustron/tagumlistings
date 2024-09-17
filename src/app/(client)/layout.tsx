// components
import ClientHeader from "@/app/(client)/_components/shared/header"
import ClientFooter from "@/app/(client)/_components/shared/footer"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
// import SessionProvider from "@/components/providers/session"

// utils
// import { dataSerializer } from "@/lib/utils"

// actions
// import { getSession } from "@/app/(auth)/_actions/get-session"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HydrationBoundaryWrapper>
      <ClientHeader />
      {children}
      <ClientFooter />
    </HydrationBoundaryWrapper>
  )
}
