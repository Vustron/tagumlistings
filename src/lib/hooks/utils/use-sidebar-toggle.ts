// utils
import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"

interface useSidebarToggleStore {
  isOpen: boolean
  setIsOpen: () => void
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: true,
      setIsOpen: () => {
        set({ isOpen: !get().isOpen })
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
