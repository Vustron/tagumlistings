import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "TagumListing"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: "bold",
          color: "#1a1a1a",
        }}
      >
        TagumListing
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#666666",
        }}
      >
        Find Your Perfect Home
      </div>
    </div>,
    {
      ...size,
    },
  )
}
