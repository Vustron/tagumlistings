"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Home, LayoutGrid, Loader2, LogOut, UserCog, Users } from "lucide-react"
import { AccountSwitcher } from "@/components/shared/account-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// actions
import { accountSwitch } from "@/lib/actions/auth/account-switch"
import { logout } from "@/lib/actions/auth/logout"

// hooks
import { useQueryAccounts } from "@/lib/hooks/auth/query-accounts"
import { useRouter } from "next-nprogress-bar"
import { useMemo, useState } from "react"

// utils
import {
  getInitials,
  dataSerializer,
  clientErrorHandler,
  isValidSessionData,
} from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import Link from "next/link"

// types
import type { SessionData } from "@/lib/config/session"

import type { UserData } from "@/lib/types"

interface UserButtonProps {
  isOnClient?: boolean
}

const UserButton = ({ isOnClient }: UserButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const router = useRouter()
  const { user, accounts, isLoading } = useQueryAccounts()

  const userData: SessionData | undefined =
    user && isValidSessionData(user)
      ? dataSerializer<SessionData>(user)
      : undefined

  const filteredAccounts = useMemo(() => {
    if (!accounts) return []
    if (userData?.role === "agent") {
      return accounts.filter((account) => account.role === "agent")
    }
    if (userData?.role === "admin") {
      return accounts.filter((account) => account.role === "admin")
    }
    return accounts
  }, [accounts, userData?.role])

  // logout handler
  const handleLogout = async () => {
    await toast.promise(logout(), {
      loading: <span className="animate-pulse">Logging out...</span>,
      success: "Logged out",
      error: (error: unknown) => clientErrorHandler(error),
    })

    if (!isOnClient) {
      router.push("/login")
    }
    router.push("/")
  }

  const handleAccountSwitch = async (account: UserData) => {
    try {
      await toast.promise(
        (async () => {
          await accountSwitch(account)

          const redirectPath =
            account.role === "admin"
              ? "/admin"
              : account.role === "agent"
                ? "/agent"
                : "/"

          router.refresh()
          router.push(redirectPath)
          setShowAccountSwitcher(false)
        })(),
        {
          loading: <span className="animate-pulse">Switching account...</span>,
          success: "Account switched successfully",
          error: (error: unknown) => clientErrorHandler(error),
        },
      )
    } catch (error) {
      console.error("Error switching account:", error)
    }
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="relative size-8 rounded-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-800">
                        <Loader2 className="animate-spin size-5 text-green-600 dark:text-green-500" />
                      </div>
                    ) : (
                      <Avatar className="hover:scale-110 size-8">
                        <AvatarFallback className="bg-gray-200 text-black">
                          {getInitials(userData?.name || "User")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AnimatePresence>
          {isOpen && (
            <DropdownMenuContent
              className="w-[250px] border-none dark:text-white text-black shadow-xl"
              align="end"
              forceMount
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.001 }}
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.001 }}
                      className="font-extrabold dark:text-white text-black leading-none"
                    >
                      {userData?.name}
                    </motion.h2>
                    <motion.h6
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.001 }}
                      className="text-xs text-muted-foreground leading-none"
                    >
                      {userData?.email}
                    </motion.h6>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

                <DropdownMenuGroup>
                  <MenuItem
                    icon={isOnClient ? Home : LayoutGrid}
                    text={isOnClient ? "Home" : "Dashboard"}
                    href={isOnClient ? "/" : "/admin"}
                    delay={0.001}
                  />
                  <MenuItem
                    icon={UserCog}
                    text="Account"
                    href={isOnClient ? "/account" : "/admin/account"}
                    delay={0.001}
                  />
                  {userData?.role !== "client" && (
                    <DropdownMenuItem
                      onSelect={() => setShowAccountSwitcher(true)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.001 }}
                        className="flex items-center hover:font-bold hover:cursor-pointer dark:hover:text-white"
                      >
                        <Users className="mr-3 size-4 text-muted-foreground dark:text-white" />
                        Switch Account
                      </motion.div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

                <MenuItem
                  icon={LogOut}
                  text="Sign out"
                  onClick={handleLogout}
                  delay={0.001}
                />
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>

      <AccountSwitcher
        accounts={filteredAccounts}
        open={showAccountSwitcher}
        onOpenChange={setShowAccountSwitcher}
        onSelect={handleAccountSwitch}
      />
    </>
  )
}

export default UserButton

interface MenuItemProps {
  icon: React.ElementType
  text: string
  href?: string
  onClick?: () => void
  delay: number
}

function MenuItem({ icon: Icon, text, href, onClick, delay }: MenuItemProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center hover:font-bold hover:cursor-pointer dark:hover:text-white"
    >
      <Icon className="mr-3 size-4 text-muted-foreground dark:text-white" />
      {text}
    </motion.div>
  )

  if (href) {
    return (
      <DropdownMenuItem asChild>
        <Link href={href}>{content}</Link>
      </DropdownMenuItem>
    )
  }

  return <DropdownMenuItem onClick={onClick}>{content}</DropdownMenuItem>
}
