"use client"

// assets
import appLogo from "@/app/assets/icons/logo_2.png"

// utils
import Image from "next/image"

// hooks
import { useRange } from "@/lib/hooks/use-range"
import useScrollPosition from "@react-hook/window-scroll"

const ClientHeader = () => {
  const y = useScrollPosition(60)
  const navX = useRange(y, 0, 50, 0, 42)
  const logoScale = useRange(y, 0, 50, 1, 0.8)
  const titleY = useRange(y, 0, 50, 0, 30)

  return (
    <>
      <header className="flex gap-4 bg-black px-6 py-4 pl-16 text-sm relative h-16">
        <Image
          style={{
            transform: `scale(${logoScale})`,
          }}
          src={appLogo}
          alt="logo"
          className="size-10 fixed left-6 top-1 z-10"
        />
        <h1
          className="ml-3 -mt-1 text-xl font-bold text-green-600 absolute"
          style={{
            transform: `translateY(${titleY}px)`,
            left: `calc(2rem + ${40 * logoScale}px)`,
          }}
        >
          TagumListings
        </h1>
      </header>
      <nav className="sticky top-0 flex border-b border-zinc-700 bg-zinc-900 text-sm">
        <ol
          style={{
            transform: `translateX(${navX}px)`,
          }}
          className="relative flex gap-4 px-6 py-4 text-zinc-400"
        >
          <li className="text-green-600 font-bold">Properties</li>
          <li>Categories</li>
          <li>Search</li>
          <li>About Us</li>
          <li>Contact</li>
        </ol>
      </nav>
    </>
  )
}

export default ClientHeader
