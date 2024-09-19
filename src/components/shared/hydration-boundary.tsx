"use server"

// actions
import { preFetchProperties } from "@/app/(admin)/_actions/get-properties"
import { preFetchAccounts } from "@/app/(auth)/_actions/get-accounts"
import { preFetchAccount } from "@/app/(auth)/_actions/get-account"

// utils
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

const HydrationBoundaryWrapper = ({
  children,
  accountId,
}: {
  children: React.ReactNode
  accountId?: string
}) => {
  const queryClient = new QueryClient()

  void queryClient.prefetchQuery({
    queryKey: ["account", accountId],
    queryFn: async () => preFetchAccount(accountId!),
  })

  void queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => preFetchAccounts(),
  })

  void queryClient.prefetchQuery({
    queryKey: ["properties"],
    queryFn: async () => preFetchProperties(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default HydrationBoundaryWrapper
