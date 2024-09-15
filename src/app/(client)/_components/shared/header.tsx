"use client"

// components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchButton from "@/app/(client)/_components/shared/search-button"
import UserButton from "@/components/shared/user-button"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Menu } from "lucide-react"

// assets
import appLogo from "@/app/assets/icons/logo_2.png"

// utils
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// hooks
import { useTransform, useScroll } from "framer-motion"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface NavLink {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: "/properties", label: "Properties" },
  { href: "/search", label: "Search" },
  { href: "/contact", label: "Contact" },
  { href: "/payments", label: "Payments" },
  { href: "/appointments", label: "Appointments" },
  { href: "/reserved", label: "Reserved" },
  { href: "/account", label: "Account" },
]

const ClientHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathName = usePathname()

  const navX = useTransform(scrollY, [0, 50], [0, 42])
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8])
  const titleY = useTransform(scrollY, [0, 50], [0, 30])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1])

  useEffect(() => {
    const handleResize = () => setIsOpen(false)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-wrap items-center justify-between px-4 md:px-6 py-4 text-sm relative h-16 z-30 bg-white dark:bg-black"
      >
        <motion.div
          className="absolute inset-0 bg-white dark:bg-black pointer-events-none"
          style={{ opacity: headerBgOpacity }}
        />

        <div className="flex items-center bg-white dark:bg-black">
          <motion.div style={{ scale: logoScale }} className="mr-2">
            <Image src={appLogo} alt="logo" width={44} height={44} />
          </motion.div>
          <motion.div style={{ y: titleY }}>
            <Link href="/" passHref>
              <motion.h1
                className="text-lg md:text-xl font-bold text-green-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                TagumListings
              </motion.h1>
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <SearchButton />
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {/* <UserButton isOnClient /> */}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col h-full bg-white dark:bg-zinc-900"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <h2 className="text-lg font-semibold">Menu</h2>
                </motion.div>
                <nav className="flex-grow">
                  <AnimatePresence>
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${
                            pathName === link.href
                              ? "font-bold text-green-500"
                              : ""
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </nav>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto p-4 border-t"
                >
                  <div className="flex items-center justify-center gap-20">
                    <ThemeToggle />
                    <UserButton isOnClient />
                  </div>
                </motion.div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 hidden md:flex border-b bg-white dark:bg-black text-sm overflow-x-auto z-20"
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
