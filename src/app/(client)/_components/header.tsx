"use client"

// components

import SearchButton from "@/app/(client)/_components/search-button"
import UserButton from "@/components/shared/user-button"
import ThemeToggle from "@/components/ui/theme-toggle"

// assets
import appLogo from "@/app/assets/icons/logo_2.png"

// utils
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// hooks
import { useTransform, useScroll } from "framer-motion"
// import { useRange } from "@/lib/hooks/use-range"
// import useScrollPosition from "@react-hook/window-scroll"
import { usePathname } from "next/navigation"

const ClientHeader = () => {
  const { scrollY } = useScroll()
  const pathName = usePathname()

  const navX = useTransform(scrollY, [0, 50], [0, 42])
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8])
  const titleY = useTransform(scrollY, [0, 50], [0, 30])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1])

  const navLinks = [
    { href: "/properties", label: "Properties" },
    { href: "/search", label: "Search" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-wrap gap-4 px-4 md:px-6 py-4 text-sm relative h-16 z-30"
      >
        <motion.div
          className="absolute inset-0 bg-white dark:bg-zinc-900"
          style={{ opacity: headerBgOpacity }}
        />
        <motion.div
          style={{ scale: logoScale }}
          className="fixed left-6 top-1 z-10"
        >
          <Image src={appLogo} alt="logo" className="size-11" />
        </motion.div>

        <motion.div
          style={{
            y: titleY,
            x: useTransform(logoScale, (s) => `calc(2rem + ${40 * s}px)`),
          }}
          className="absolute"
        >
          <Link href="/">
            <motion.h1
              className="ml-2 -mt-1 text-lg md:text-xl font-bold text-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              TagumListings
            </motion.h1>
          </Link>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center space-x-2 justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SearchButton />
          <ThemeToggle />
          <UserButton />
        </motion.div>
      </motion.header>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 flex border-b bg-white dark:bg-black text-sm overflow-x-auto z-20"
      >
        <motion.ol
          style={{ x: navX }}
          className="relative flex gap-4 px-6 py-4 text-zinc-500 dark:text-zinc-400"
        >
          {navLinks.map((link) => (
            <motion.li
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className={`${
                  pathName === link.href ? "font-bold text-green-500" : ""
                } hover:text-green-500 transition-colors`}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </motion.nav>
    </>
  )
}

export default ClientHeader
