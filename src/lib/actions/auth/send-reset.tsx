"use server"

// config
import { env } from "@/lib/config/env"
import redis from "@/lib/config/redis"

// utils
import EmailTemplate from "@/lib/config/email-template"
import { transporter } from "@/lib/config/nodemailer"
import { render } from "@react-email/components"
import { createUniqueId } from "@/lib/utils"

// types
import type { UserData } from "@/lib/types"

// send email to reset password method
export default async function sendEmailToResetPassword(
  email: string | undefined,
) {
  if (!email) {
    console.log("Email is required")
    return null
  }

  // init token generator
  const resetPasswordToken = createUniqueId()

  // init user database key
  const userDatabaseKey = "accounts"

  // init reset password database key
  const resetPasswordTokenDatabaseKey = `reset-password-tokens_${encodeURIComponent(resetPasswordToken)}`

  // get the database name using key
  const existingUserData = await redis.get(userDatabaseKey)

  // set all the user data in an array then parse
  const users: UserData[] = existingUserData
    ? (JSON.parse(existingUserData) as UserData[])
    : []

  // check if user exists
  const user = users.find((user: UserData) => user.email === email)

  if (!user) {
    console.log("User doesn't exist")
    return null
  }

  // set verification data
  const resetPasswordData = {
    resetPasswordToken,
    email,
  }

  // Save the updated users array back to Redis
  await redis.set(
    resetPasswordTokenDatabaseKey,
    JSON.stringify(resetPasswordData),
  )

  // expire in three minutes
  await redis.expire(resetPasswordTokenDatabaseKey, 180)

  // init reset link
  const resetPasswordLink = `${env.NEXT_PUBLIC_APP_URL}/new-password?token=${encodeURIComponent(resetPasswordToken)}`

  // init reset password email
  const resetPasswordEmail = await render(
    <EmailTemplate
      resetPassword
      resetPasswordLink={resetPasswordLink}
      userName={user.name}
    />,
  )

  // init mail options
  const mailOptions = {
    from: `Tagumlistings ${env.EMAIL}`,
    to: email,
    subject: "Reset Account Password",
    html: resetPasswordEmail,
  }

  // send the email
  await transporter.sendMail(mailOptions)
}
