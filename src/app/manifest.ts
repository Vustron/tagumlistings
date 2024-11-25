import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TagumListings",
    short_name: "TagumListings",
    description: "Find your perfect home with TagumListings",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      {
        src: "./assets/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./assets/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./assets/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "./assets/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    orientation: "portrait",
    display_override: ["standalone", "browser"],
    categories: ["real estate", "business"],
    screenshots: [
      {
        src: "./assets/images/home.png",
        sizes: "1280x720",
        type: "image/png",
      },
    ],
    prefer_related_applications: false,
  }
}
