// components
import ImagekitProvider from "@/components/providers/imagekit"
import ProgressBarProvider from "@/components/providers/progress-bar"
import QueryProvider from "@/components/providers/query"
import ThemeProvider from "@/components/providers/themes"
import ToastProvider from "@/components/providers/toast"
import { TooltipProvider } from "@/components/ui/tooltip"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider disableHoverableContent>
        <QueryProvider>
          <ProgressBarProvider>
            <ToastProvider />
            <ImagekitProvider>{children}</ImagekitProvider>
          </ProgressBarProvider>
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
