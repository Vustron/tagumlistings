// actions
import sendEmailToResetPassword from "@/lib/actions/auth/send-reset"

// utils
import { sanitizer } from "@/lib/utils"
import DOMPurify from "dompurify"

// validation
import { resetPasswordEmailSchema } from "@/lib/validation"

// types
import type { ResetPasswordValues } from "@/lib/validation"

export default async function resetPasswordLink(values: ResetPasswordValues) {
  const purify = DOMPurify
  const sanitizedData = sanitizer<ResetPasswordValues>(
    values,
    resetPasswordEmailSchema,
    purify,
  )

  return await sendEmailToResetPassword(sanitizedData.email)
}
