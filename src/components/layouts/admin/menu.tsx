"use client"

// components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CollapseMenuButton } from "@/components/ui/collapse-menu-button"
import { Ellipsis, Loader2, LogOut } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

// actions
import { logout } from "@/lib/actions/auth/logout"

// hooks
import { useRouter } from "next-nprogress-bar"
import { usePathname } from "next/navigation"
import { useState } from "react"

// utils
import { getMenuList } from "@/lib/misc/menu-lists"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MenuProps {
  isOpen: boolean | undefined
}

const Menu = ({ isOpen }: MenuProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const menuList = getMenuList(pathname)
  const [signOut, setIsSignOut] = useState(false)

  const handleLogout = async () => {
    setIsSignOut(true)
    await toast
      .promise(logout(), {
        loading: <span className="animate-pulse">Logging out...</span>,
        success: "Logged out",
        error: (error: unknown) => clientErrorHandler(error),
      })
      .then(() => {
        setIsSignOut(false)
      })
    router.replace("/login")
  }

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-7">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2" />
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={`w-full justify-start h-10 mb-1 ${active ? "bg-green-600 text-white hover:bg-green-400" : "text-black dark:text-white bg-background"}`}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100",
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                    disabled={signOut}
                  >
                    {signOut ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <>
                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                          <LogOut size={18} />
                        </span>

                        <p
                          className={cn(
                            "whitespace-nowrap",
                            isOpen === false
                              ? "opacity-0 hidden"
                              : "opacity-100",
                          )}
                        >
                          Sign out
                        </p>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  )
}

export default Menu
