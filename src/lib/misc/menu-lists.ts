// components
import {
  ClipboardPen,
  HandCoins,
  LandPlot,
  LayoutGrid,
  Settings,
  Users,
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
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/appointments",
          label: "Appointments",
          active: pathname.includes("/appointments"),
          icon: ClipboardPen,
          submenus: [],
        },
        {
          href: "/properties",
          label: "Properties",
          active: pathname.includes("/properties"),
          icon: LandPlot,
          submenus: [],
        },
        {
          href: "/payments",
          label: "Payments",
          active: pathname.includes("/payments"),
          icon: HandCoins,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ]
}
