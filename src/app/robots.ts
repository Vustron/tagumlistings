import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/account",
          "/appointments",
          "/contact",
          "/payments",
          "/properties",
          "/reserved",
          "/search",
        ],
      },
      {
        userAgent: "*",
        allow: ["/login", "/register", "/forgot-password", "/new-password"],
      },
      {
        userAgent: "*",
        disallow: ["/admin/*"],
      },
      {
        // Block API routes
        userAgent: "*",
        disallow: ["/api/*"],
      },
    ],
    sitemap: "https://rmetagumlisting.vercel.app/sitemap.xml",
  }
}
