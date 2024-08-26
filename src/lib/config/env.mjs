// utils
import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"
import { z } from "zod"

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  // server env
  server: {
    API_URL: z.string().url(),
  },
  // client env
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
    NEXT_PUBLIC_UPLOAD_PRESET: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_UPLOAD_PRESET: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
