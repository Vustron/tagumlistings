// utils
import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex min-h-[100vh] flex-col items-center justify-center">
      <h1 className="max-w-md scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Can&apos;t seem to find this page. 🧐
      </h1>

      <Link href="/">
        <p className="mt-[50px] font-md hover:text-slate-700 animate-pulse text-center text-xl">
          Go back
        </p>
      </Link>
    </section>
  )
}
