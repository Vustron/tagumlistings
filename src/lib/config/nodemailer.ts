// utils
import nodemailer from "nodemailer"

// configs
import { env } from "@/lib/config/env"

// init node mailer
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL,
    pass: env.PASS,
  },
})
