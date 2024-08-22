// utils
import { env } from "@/lib/config/env.mjs"

// types
import type { SiteConfig } from "@/lib/types"

// base url
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin
  if (env.NEXT_PUBLIC_APP_URL) return `https://${env.NEXT_PUBLIC_APP_URL}`
  return "http://localhost:3000"
}

// site config
export const siteConfig: SiteConfig = {
  meta: {
    metadataBase: new URL(getBaseUrl()),
    title: {
      template: "%s | TagumListings",
      default: "TagumListings",
    },
    applicationName: "TagumListings",
    description:
      "A web-based real estate brokenage appointment and reservation system for RME",
    openGraph: { images: ["/og"] },
    icons: [{ rel: "icon", url: "/icons/icon.ico" }],
  },
  viewport: {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "hsl(0 0% 100%)" },
      { media: "(prefers-color-scheme: dark)", color: "hsl(240 10% 3.9%)" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}
