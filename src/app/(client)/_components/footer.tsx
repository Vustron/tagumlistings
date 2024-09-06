// utils
import { Button } from "@/components/ui/button"
import { Facebook, Github, Twitter } from "lucide-react"

import Link from "next/link"

const ClientFooter = () => {
  return (
    <footer className="dark:bg-zinc-900 bg-white">
      <section>
        <div className="mx-auto max-w-5xl p-6 sm:p-8 grid gap-6">
          <div className="mb-4 flex flex-col gap-4 md:mb-0 md:flex-row">
            <Link href="/" className="hover:scale-110 hover:text-green-500">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:scale-110 hover:text-green-500">
              Terms of Service
            </Link>
            <Link href="/" className="hover:scale-110 hover:text-green-500">
              Cookie Policy
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl p-6 sm:p-8 not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hover:scale-110 ">
              <Github />
            </Button>
            <Button variant="outline" size="icon" className="hover:scale-110">
              <Twitter />
            </Button>
            <Button variant="outline" size="icon" className="hover:scale-110">
              <Facebook />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground hover:scale-110 hover:text-green-500 cursor-pointer">
            © TagumListings All rights reserved 2024
          </p>
        </div>
      </section>
    </footer>
  )
}

export default ClientFooter
