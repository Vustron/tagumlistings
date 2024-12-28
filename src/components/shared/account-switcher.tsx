"use client"

import {
  Command,
  CommandList,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandDialog,
} from "@/components/ui/command"
import VisuallyHiddenComponent from "@/components/ui/visually-hidden"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import type { UserData } from "@/lib/types"

interface AccountSwitcherProps {
  accounts: UserData[] | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (account: UserData) => void
}

const getRoleBadgeVariant = (role?: string) => {
  switch (role) {
    case "admin":
      return "destructive" as const
    case "agent":
      return "default" as const
    case "client":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

export const AccountSwitcher = ({
  accounts,
  open,
  onOpenChange,
  onSelect,
}: AccountSwitcherProps) => {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <VisuallyHiddenComponent>
          <DialogHeader>
            <DialogTitle>Switch Account</DialogTitle>
          </DialogHeader>
        </VisuallyHiddenComponent>
        <CommandInput placeholder="Search accounts..." />
        <CommandList>
          <CommandEmpty>No accounts found.</CommandEmpty>
          <CommandGroup heading="Accounts">
            {accounts?.map((account) => (
              <CommandItem
                key={account.id}
                onSelect={() => onSelect(account)}
                className="flex items-center gap-2 p-2 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-sm dark:text-muted-foreground">
                    {account.email}
                  </span>
                </div>
                <Badge
                  variant={getRoleBadgeVariant(account.role)}
                  className="ml-auto capitalize"
                >
                  {account.role}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
