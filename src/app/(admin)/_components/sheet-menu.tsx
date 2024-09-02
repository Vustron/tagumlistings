// components
import Menu from "@/app/(admin)/_components/menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"

// assets
import logo from "@/app/assets/icons/logo.jpg"

// utils
import Image from "next/image"
import Link from "next/link"

const SheetMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            {/* brand logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="logo"
                priority
                height={500}
                width={500}
                sizes="100vh"
                className="object contain rounded-full size-8"
              />

              <h1 className="font-bold text-lg text-green-600">
                TagumListings
              </h1>
            </Link>
          </Button>
        </SheetHeader>

        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}

export default SheetMenu
