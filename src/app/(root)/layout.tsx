// utils
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <HydrationBoundaryWrapper>{children}</HydrationBoundaryWrapper>
}
