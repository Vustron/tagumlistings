import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query"

interface QueryHydratorProps {
  children: React.ReactNode
  prefetchFns?: Array<(queryClient: QueryClient) => Promise<any>>
}

async function prefetchQueries(
  queryClient: QueryClient,
  prefetchFns: Array<(queryClient: QueryClient) => Promise<any>> = [],
) {
  for (const prefetch of prefetchFns) {
    const queryOptions = await prefetch(queryClient)
    if (queryOptions?.queryKey) {
      await queryClient.prefetchQuery(queryOptions)
    }
  }
  return queryClient
}

const QueryHydrator = async ({
  children,
  prefetchFns = [],
}: QueryHydratorProps) => {
  const queryClient = new QueryClient()
  await prefetchQueries(queryClient, prefetchFns)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default QueryHydrator
