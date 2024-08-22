// utils
import { fileURLToPath } from "node:url"
import withBundleAnalyzer from "@next/bundle-analyzer"
import createJiti from "jiti"

// configure the bundle analyzer
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

// configure jiti
const jiti = createJiti(fileURLToPath(import.meta.url))
jiti("./src/lib/config/env.mjs")

// configure content security policy
const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live va.vercel-scripts.com https://upload-widget.cloudinary.com/global/all.js;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data: https://upload-widget.cloudinary.com/global/all.js;
    media-src 'none';
    connect-src *;
    font-src 'self' data:;
    frame-src 'self' *.codesandbox.io vercel.live https://upload-widget.cloudinary.com/;
`

// configure security headers
export const securityHeaders = [
  // api
  { key: "Access-Control-Allow-Credentials", value: "true" },
  {
    key: "Access-Control-Allow-Origin",
    value: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET,DELETE,PATCH,POST,PUT",
  },
  {
    key: "Access-Control-Allow-Headers",
    value:
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },

  // header security
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "preFetch-src",
    value: "false",
  },
]

/** @type {import('next').NextConfig} */

const nextConfig = {
  // experimental
  experimental: {
    // caching
    staleTimes: {
      dynamic: 0,
    },

    // turbo configs
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
      resolveAlias: {
        underscore: "lodash",
        mocha: { browser: "mocha/browser-entry.js" },
      },
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
        ".jsonc",
      ],
    },
  },

  // headers
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },

  // image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
    ],
  },

  // logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default withBundleAnalyzerConfig(nextConfig)
