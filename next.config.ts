// utils
import withBundleAnalyzer from "@next/bundle-analyzer"

// types
type ImageFormat = "image/webp" | "image/avif"

// configure the bundle analyzer
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

// configure content security policy
const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live va.vercel-scripts.com https://upload-widget.cloudinary.com/global/all.js firestore.googleapis.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data: https://upload-widget.cloudinary.com/global/all.js;
    media-src 'none';
    connect-src 'self' firestore.googleapis.com firebasestorage.googleapis.com;
    font-src 'self' data:;
    frame-src 'self' *.codesandbox.io vercel.live https://upload-widget.cloudinary.com/;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

// init allowed origins
const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL,
  "http://127.0.0.1:8000",
]

// configure security headers
export const securityHeaders = [
  // api
  { key: "Access-Control-Allow-Credentials", value: "true" },
  {
    key: "Access-Control-Allow-Origin",
    value: allowedOrigins.join(", "),
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

const nextConfig: import("next").NextConfig = {
  // Automatically bundle external packages in the Pages Router:
  bundlePagesRouterDependencies: true,

  // experimental
  experimental: {
    // react compiler
    reactCompiler: true,
    // enables unstable_after
    after: true,
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
    formats: ["image/webp", "image/avif"] as ImageFormat[],
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https" as const,
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https" as const,
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https" as const,
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https" as const,
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https" as const,
        hostname: "placehold.co",
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
