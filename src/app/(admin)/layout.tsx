// utils
import SidePanel from "@/app/(admin)/_components/shared/side-panel"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidePanel>
      <HydrationBoundaryWrapper>{children}</HydrationBoundaryWrapper>
    </SidePanel>
  )
}
