// components
import SessionProvider from "@/components/providers/session"

// utils
import SidePanel from "@/components/layouts/admin/side-panel"
import { dataSerializer } from "@/lib/utils"

// actions
import { getSession } from "@/lib/actions/session/get"

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <SessionProvider value={userData}>
      <SidePanel>{children}</SidePanel>
    </SessionProvider>
  )
}
