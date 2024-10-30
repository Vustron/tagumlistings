"use client"

// components
import { Button } from "@/components/ui/button"
import { Facebook, Mail } from "lucide-react"

// utils
import { motion } from "framer-motion"
// import Link from "next/link"

// const footerLinks = [
//   { href: "/privacy", text: "Privacy Policy" },
//   { href: "/terms", text: "Terms of Service" },
//   { href: "/cookies", text: "Cookie Policy" },
// ]

const socialIcons = [
  // { Icon: Github, href: "https://github.com" },
  { Icon: Mail, href: "mailto:rmerusselrealty@yahoo.com" },
  { Icon: Facebook, href: "https://www.facebook.com/RMERUSSELREALTY" },
]

const ClientFooter = () => {
  return (
    <footer className="bg-white dark:bg-black text-gray-600 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          {/* <nav className="flex flex-wrap justify-center md:justify-start gap-6 mb-8">
            {footerLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className="hover:text-green-500 transition-colors duration-200"
                >
                  {link.text}
                </Link>
              </motion.div>
            ))}
          </nav> */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8">
            <motion.div
              className="flex gap-4 mb-6 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {socialIcons.map(({ Icon, href }) => (
                <motion.div
                  key={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent hover:bg-green-400"
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              className="text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              © {new Date().getFullYear()} TagumListings. All rights reserved.
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ClientFooter
