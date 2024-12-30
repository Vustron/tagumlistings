// components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, ServerCrash } from "lucide-react"

// utils
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <Loader2 className="size-20 animate-spin text-green-500" />
    </div>
  )
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Alert variant="destructive">
        <ServerCrash className="size-7 text-zinc-500 my-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          <span className="text-red-600">{error.message}</span>
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

const FallbackBoundary = ({
  children,
  accountId,
  appointmentId,
  paymentId,
  propertyId,
}: {
  children: React.ReactNode
  accountId?: string
  appointmentId?: string
  paymentId?: string
  propertyId?: string
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={ErrorFallback}
          resetKeys={[accountId, appointmentId, paymentId, propertyId]}
        >
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default FallbackBoundary
