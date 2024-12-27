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
  const baseRoute = role === "agent" ? "/agent" : "/admin"

  const contentMenus: Menu[] = [
    {
      href: baseRoute,
      label: "Dashboard",
      active: pathname === baseRoute,
      icon: LayoutGrid,
      submenus: [],
    },
    {
      href: `${baseRoute}/appointments`,
      label: "Appointments",
      active: pathname.includes(`${baseRoute}/appointments`),
      icon: ClipboardPen,
      submenus: [],
    },
    {
      href: `${baseRoute}/properties`,
      label: "Properties",
      active: pathname.includes(`${baseRoute}/properties`),
      icon: LandPlot,
      submenus: [],
    },
    {
      href: `${baseRoute}/records`,
      label: "Records",
      active: pathname.includes(`${baseRoute}/records`),
      icon: LibraryBig,
      submenus: [],
    },
    {
      href: `${baseRoute}/messages`,
      label: "Messages",
      active: pathname.includes(`${baseRoute}/messages`),
      icon: MessageSquareText,
      submenus: [],
    },
  ]

  const settingsMenus: Menu[] = [
    {
      href: `${baseRoute}/account`,
      label: "Account",
      active: pathname.includes(`${baseRoute}/account`),
      icon: Settings,
      submenus: [],
    },
  ]

  if (role === "admin") {
    settingsMenus.unshift({
      href: `${baseRoute}/users`,
      label: "Users",
      active: pathname.includes(`${baseRoute}/users`),
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
