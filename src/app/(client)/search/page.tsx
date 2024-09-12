// components
import { BlurFade } from "@/components/shared/blur-fade"
import SearchClient from "@/app/(client)/_components/search/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Search Property",
}

export default function SearchPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-zinc-900 dark:text-white relative px-4 sm:px-8">
      <BlurFade delay={0.25} inView className="relative z-10 w-full">
        <SearchClient />
      </BlurFade>
    </main>
  )
}
