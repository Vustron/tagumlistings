"use client"

// components
import Footer from "@/app/(admin)/_components/footer"
import Sidebar from "@/app/(admin)/_components/sidebar"

// utils
import { cn } from "@/lib/utils"

// hooks
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle"
import { useStore } from "@/lib/hooks/use-store"

const SidePanel = ({ children }: { children: React.ReactNode }) => {
  // init sidebar toggle
  const sidebar = useStore(useSidebarToggle, (state) => state)

  if (!sidebar) return null

  return (
    <>
      {/* sidebar */}
      <Sidebar />

      <main
        className={cn(
          "min-h-[calc(100vh-56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 z-20",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </main>

      {/* footer */}
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        <Footer />
      </footer>
    </>
  )
}

export default SidePanel
