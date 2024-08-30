"use client"

// assets
import appLogo from "@/app/assets/icons/logo_2.png"
import UserButton from "@/components/shared/user-button"
import ThemeToggle from "@/components/ui/theme-toggle"

// utils
import Image from "next/image"

// hooks
import { useRange } from "@/lib/hooks/use-range"
import useScrollPosition from "@react-hook/window-scroll"
import SearchButton from "./search-button"

const ClientHeader = () => {
  const y = useScrollPosition(60)
  const navX = useRange(y, 0, 50, 0, 42)
  const logoScale = useRange(y, 0, 50, 1, 0.8)
  const titleY = useRange(y, 0, 50, 0, 30)

  const handleSearch = (query: string) => {
    console.log("Searching for:", query)
    // Perform your search logic here
  }

  return (
    <>
      <header className="flex gap-4 bg-white dark:bg-black px-4 md:px-6 py-4 pl-16 text-sm relative h-16 z-30">
        <Image
          style={{
            transform: `scale(${logoScale})`,
          }}
          src={appLogo}
          alt="logo"
          className="size-11 fixed left-6 top-1 z-20"
        />
        <h1
          className="ml-2 -mt-1 text-lg md:text-xl font-bold text-green-600 absolute"
          style={{
            transform: `translateY(${titleY}px)`,
            left: `calc(2rem + ${40 * logoScale}px)`,
          }}
        >
          TagumListings
        </h1>

        <div className="flex flex-1 items-center space-x-2 justify-end">
          <SearchButton onSearch={handleSearch} />
          <ThemeToggle />
          <UserButton />
        </div>
      </header>
      <nav className="sticky top-0 flex border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm overflow-x-auto z-20">
        <ol
          style={{
            transform: `translateX(${navX}px)`,
          }}
          className="relative flex gap-4 px-6 py-4 text-zinc-500 dark:text-zinc-400"
        >
          <li className="text-green-600 font-bold">Properties</li>
          <li>Categories</li>
          <li>About</li>
          <li>Contact</li>
        </ol>
      </nav>
    </>
  )
}

export default ClientHeader
