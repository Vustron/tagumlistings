// components
import Projects from "@/components/layouts/client/projects"
import HeroSection from "@/components/layouts/client/hero"
import { BlurFade } from "@/components/shared/blur-fade"
import About from "@/components/layouts/client/about"
import Lights from "@/components/shared/lights"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-zinc-900 dark:text-white relative px-4 sm:px-8">
      <BlurFade delay={0.25} inView className="relative z-10 w-full">
        <HeroSection className="mt-32" />
        <About />
        <Projects />
      </BlurFade>
      <div className="absolute inset-0 z-0 animate-appear opacity-0 pointer-events-none">
        <Lights />
      </div>
    </main>
  )
}
