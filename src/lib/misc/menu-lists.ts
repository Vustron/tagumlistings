// components
import {
  Users,
  LandPlot,
  Settings,
  HandCoins,
  LayoutGrid,
  ClipboardPen,
  // ClipboardPlus,
  MessageSquareText,
} from "lucide-react"

// types
import type { LucideIcon } from "lucide-react"

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/admin/appointments",
          label: "Appointments",
          active: pathname.includes("/admin/appointments"),
          icon: ClipboardPen,
          submenus: [],
        },
        {
          href: "/admin/properties",
          label: "Properties",
          active: pathname.includes("/admin/properties"),
          icon: LandPlot,
          submenus: [],
        },
        {
          href: "/admin/transactions",
          label: "Transactions",
          active: pathname.includes("/admin/transactions"),
          icon: HandCoins,
          submenus: [],
        },
        {
          href: "/admin/messages",
          label: "Messages",
          active: pathname.includes("/admin/messages"),
          icon: MessageSquareText,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/admin/users",
          label: "Users",
          active: pathname.includes("/admin/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/admin/account",
          label: "Account",
          active: pathname.includes("/admin/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ]
}
