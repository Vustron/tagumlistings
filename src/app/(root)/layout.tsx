// utils
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <HydrationBoundaryWrapper>{children}</HydrationBoundaryWrapper>
}
