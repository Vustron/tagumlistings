// components
import Providers from "@/components/providers"

// configs
import { siteConfig } from "@/lib/config/meta-data"

// utils
import { inter } from "@/lib/fonts"
import "@/lib/styles/globals.css"

// init meta data
export const metadata = siteConfig.meta
export const viewport = siteConfig.viewport

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
