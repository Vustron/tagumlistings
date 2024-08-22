// components

import QueryProvider from "@/components/providers/query"
import ToastProvider from "@/components/providers/toast"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ToastProvider />
      {children}
    </QueryProvider>
  )
}

export default Providers
