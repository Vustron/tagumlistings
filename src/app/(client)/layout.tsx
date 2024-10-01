// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
// import SessionProvider from "@/components/providers/session"
import ClientHeader from "@/components/layouts/client/header"
import ClientFooter from "@/components/layouts/client/footer"

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
