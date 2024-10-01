// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { ImageKitAuthProps } from "@/lib/types"

export async function imageKitAuth(): Promise<ImageKitAuthProps | undefined> {
  try {
    const data = await httpRequest<void, ImageKitAuthProps>(
      "/auth/imagekit",
      "GET",
    )
    const { signature, expire, token } = data
    return { signature, expire, token }
  } catch (error) {
    clientErrorHandler(error)
    return undefined
  }
}
