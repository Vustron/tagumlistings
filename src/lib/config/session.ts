// types
import type { SessionOptions } from "iron-session"

// configs
import { env } from "@/lib/config/env"

// types
import type { Property } from "@/lib/types"

export interface SessionData {
  id: string
  name: string
  address: string
  contact_number: string
  email: string
  role: string
  loggedIn?: boolean
  reservedProperties?: Property[]
}

export const sessionOptions: SessionOptions = {
  password: env.SECRET_KEY!,
  cookieName: "client-auth-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
  },
}

export const defaultSession: SessionData = {
  id: "",
  name: "",
  address: "",
  contact_number: "",
  email: "",
  role: "",
  loggedIn: false,
}
