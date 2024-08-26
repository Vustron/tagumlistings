// components
import RegisterForm from "@/app/(auth)/register/_components/register-form"
import BounceWrapper from "@/components/shared/bounce"

// assets
import bgAuth from "@/app/assets/images/bg_auth.jpg"

// utils
import Image from "next/image"
import Link from "next/link"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Register",
}

export default function RegisterPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-zinc-50 dark:bg-zinc-900">
      <BounceWrapper>
        <div className="flex h-full max-h-[33rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
            <h1 className="text-center text-3xl font-bold">
              Register New Account
            </h1>
            <div className="space-y-5">
              {/* <GoogleSignInButton /> */}

              {/* register form */}
              <RegisterForm />

              <Link
                href="/login"
                className="block text-center hover:underline"
                prefetch={false}
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>

          {/* bg */}
          <Image
            src={bgAuth}
            alt=""
            className="hidden w-1/2 object-cover md:block"
            width={1920}
            height={1080}
            priority
          />
        </div>
      </BounceWrapper>
    </main>
  )
}
