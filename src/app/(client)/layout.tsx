// components
import ClientHeader from "@/components/layouts/client/header"
import ClientFooter from "@/components/layouts/client/footer"
import SessionProvider from "@/components/providers/session"

// utils
import { dataSerializer } from "@/lib/utils"

// actions
import { getSession } from "@/lib/actions/session/get"

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // get session
  const session = await getSession()

  if (!session) {
    return (
      <>
        <ClientHeader />
        {children}
        <ClientFooter />
      </>
    )
  }

  const userData = dataSerializer(session)

  return (
    <SessionProvider value={userData}>
      <ClientHeader />
      {children}
      <ClientFooter />
    </SessionProvider>
  )
}
