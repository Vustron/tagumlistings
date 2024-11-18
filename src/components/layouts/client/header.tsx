"use client"

// components
import {
  Sheet,
  SheetTitle,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet"
import VisuallyHiddenComponent from "@/components/ui/visually-hidden"
import SearchButton from "@/components/layouts/client/search-button"
import UserButton from "@/components/shared/user-button"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// assets
import appLogo from "@/app/assets/icons/logo_2.png"

// utils
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// actions
import { updateMessagesSeenStatus } from "@/lib/actions/messages/status"

// hooks
import { useUnseenMessages } from "@/lib/hooks/messages/unseen"
import { useSession } from "@/components/providers/session"
import { useTransform, useScroll } from "framer-motion"
import { useRouter } from "next-nprogress-bar"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface NavLink {
  href: string
  label: string
  requiresAuth: boolean
}

const navLinks: NavLink[] = [
  { href: "/properties", label: "Properties", requiresAuth: false },
  { href: "/search", label: "Search", requiresAuth: false },
  { href: "/contact", label: "Contact", requiresAuth: true },
  { href: "/payments", label: "Payments", requiresAuth: true },
  { href: "/appointments", label: "Appointments", requiresAuth: true },
  { href: "/account", label: "Account", requiresAuth: true },
]

const ClientHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathName = usePathname()
  const session = useSession()
  const router = useRouter()
  const unseenMessages = useUnseenMessages(session?.id)

  const navX = useTransform(scrollY, [0, 50], [0, 42])
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8])
  const titleY = useTransform(scrollY, [0, 50], [0, 30])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1])

  useEffect(() => {
    const handleResize = () => setIsOpen(false)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filteredNavLinks = navLinks.filter(
    (link) => !link.requiresAuth || session?.loggedIn,
  )

  const handleContactClick = async () => {
    if (unseenMessages.length > 0) {
      await updateMessagesSeenStatus(unseenMessages)
    }
    router.push("/contact")
  }

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
            {!session?.loggedIn ? (
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
            ) : (
              <>
                <UserButton isOnClient />
              </>
            )}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <VisuallyHiddenComponent>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription />
            </VisuallyHiddenComponent>
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
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 bg-gradient-to-b from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 rounded-l-lg shadow-lg"
            >
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col h-full"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-4 border-b dark:border-zinc-700"
                >
                  <h2 className="text-lg font-semibold">Menu</h2>
                </motion.div>
                <nav className="flex-grow overflow-y-auto">
                  <AnimatePresence>
                    {filteredNavLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border-b dark:border-zinc-700"
                      >
                        <Link
                          href={link.href}
                          className={`${
                            pathName === link.href
                              ? "font-bold text-green-500"
                              : ""
                          } hover:text-green-500 transition-colors relative inline-flex items-center gap-1`}
                          onClick={
                            link.href === "/contact"
                              ? handleContactClick
                              : undefined
                          }
                        >
                          {link.label}
                          {link.href === "/contact" &&
                            unseenMessages.length > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 rounded-full">
                                {unseenMessages.length}
                              </span>
                            )}
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </nav>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto p-4 border-t dark:border-zinc-700"
                >
                  <div className="flex items-center justify-center gap-20">
                    <ThemeToggle />
                    {!session?.loggedIn ? (
                      <Button
                        variant="outline"
                        onClick={() => router.push("/login")}
                      >
                        Login
                      </Button>
                    ) : (
                      <UserButton isOnClient />
                    )}
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
          {filteredNavLinks.map((link) => (
            <motion.li
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={link.href}
                className={`${
                  pathName === link.href ? "font-bold text-green-500" : ""
                } hover:text-green-500 transition-colors relative inline-flex items-center gap-1`}
                onClick={
                  link.href === "/contact" ? handleContactClick : undefined
                }
              >
                {link.label}
                {link.href === "/contact" && unseenMessages.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 rounded-full">
                    {unseenMessages.length}
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </motion.nav>
    </>
  )
}

export default ClientHeader
