// components
import TailwindIndicator from "@/components/providers/tailwind-indicator"
import ProgressBarProvider from "@/components/providers/progress-bar"
import WrapBalancer from "@/components/providers/wrap-balancer"
import ImagekitProvider from "@/components/providers/imagekit"
import { ThemeProvider } from "@/components/providers/themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/components/providers/query"
import ToastProvider from "@/components/providers/toast"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WrapBalancer>
        <TooltipProvider disableHoverableContent>
          <QueryProvider>
            <ProgressBarProvider>
              <ToastProvider />
              <ImagekitProvider>{children}</ImagekitProvider>
            </ProgressBarProvider>
            <TailwindIndicator />
          </QueryProvider>
        </TooltipProvider>
      </WrapBalancer>
    </ThemeProvider>
  )
}

export default Providers
