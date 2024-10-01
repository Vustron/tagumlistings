"use client"

// actions
import { imageKitAuth } from "@/lib/actions/imagekit/auth"

// utils
import { ImageKitProvider } from "imagekitio-next"

// configs
import { env } from "@/lib/config/env.mjs"

const ImagekitProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ImageKitProvider
      publicKey={env.NEXT_PUBLIC_PUBLIC_KEY}
      urlEndpoint={env.NEXT_PUBLIC_URL_ENDPOINT}
      authenticator={async () => {
        const result = await imageKitAuth()
        return result
          ? {
              ...result,
              expire: Number(result.expire),
            }
          : { signature: "", expire: 0, token: "" }
      }}
    >
      {children}
    </ImageKitProvider>
  )
}

export default ImagekitProvider
