"use client"

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  User as FallbackUser,
  LayoutGrid,
  Loader2,
  LogOut,
  UserCog,
} from "lucide-react"

// // server actions
// import { logout } from "@/lib/server-actions/logout"

// hooks
// import { useGetAccount } from "@/lib/api/account/get-account"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler, dataSerializer } from "@/lib/utils"
import Link from "next/link"
import toast from "react-hot-toast"

// types
// import type { SessionData } from "@/lib/types"

const UserButton = () => {
  // init router
  const router = useRouter()

  // get user
  // const { data: user, isLoading, error, status } = useGetAccount(id!)

  // // stringify and parse user data
  // const userData: SessionData | undefined = user
  //   ? dataSerializer(user)
  //   : undefined

  // logout handler
  const handleLogout = async () => {
    // await toast.promise(logout(), {
    //   loading: <span className="animate-pulse">Logging out...</span>,
    //   success: "Logged out",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })
    // router.replace("/sign-in")
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative size-8 rounded-full"
              >
                {/* {isLoading ? (
                  <Loader2 className="animate-spin size-10" />
                ) : status === "error" ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    {error?.message}
                  </span>
                ) : (
                  status === "success" && (
                    <Avatar className="hover:scale-110  size-8">
                      <AvatarImage src={userData?.image} alt="Avatar" />

                      <AvatarFallback className="bg-transparent">
                        <FallbackUser className="size-6" />
                      </AvatarFallback>
                    </Avatar>
                  )
                )} */}
                <Avatar className="hover:scale-110  size-8">
                  <AvatarImage src="/images/vustron.png" alt="Avatar" />

                  <AvatarFallback className="bg-transparent">
                    <FallbackUser className="size-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-[250px] border-none dark:text-white text-black shadow-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <h2 className="font-extrabold dark:text-white text-black leading-none">
              Vustron
            </h2>
            <h6 className="text-xs text-muted-foreground leading-none">
              vustron@email.com
            </h6>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

        <DropdownMenuGroup>
          {/* dashboard */}
          <DropdownMenuItem
            className="hover:font-bold hover:cursor-pointer"
            asChild
          >
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="size-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          {/* edit */}
          <DropdownMenuItem
            className="hover:font-bold hover:cursor-pointer"
            asChild
          >
            <Link href="/account" className="flex items-center">
              <UserCog className="mr-3 size-4 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

        {/* logout */}
        <DropdownMenuItem className="hover:font-bold" onClick={handleLogout}>
          <LogOut className="mr-3 size-4 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
