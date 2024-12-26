// components
import {
  Users,
  LandPlot,
  Settings,
  LayoutGrid,
  LibraryBig,
  ClipboardPen,
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

export function getMenuList(pathname: string, role?: string): Group[] {
  const contentMenus: Menu[] = [
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
      href: "/admin/records",
      label: "Records",
      active: pathname.includes("/admin/records"),
      icon: LibraryBig,
      submenus: [],
    },
    {
      href: "/admin/messages",
      label: "Messages",
      active: pathname.includes("/admin/messages"),
      icon: MessageSquareText,
      submenus: [],
    },
  ]

  const settingsMenus: Menu[] = [
    {
      href: "/admin/account",
      label: "Account",
      active: pathname.includes("/admin/account"),
      icon: Settings,
      submenus: [],
    },
  ]

  // Only add Users menu for admin role
  if (role === "admin") {
    settingsMenus.unshift({
      href: "/admin/users",
      label: "Users",
      active: pathname.includes("/admin/users"),
      icon: Users,
      submenus: [],
    })
  }

  return [
    {
      groupLabel: "Contents",
      menus: contentMenus,
    },
    {
      groupLabel: "Settings",
      menus: settingsMenus,
    },
  ]
}
