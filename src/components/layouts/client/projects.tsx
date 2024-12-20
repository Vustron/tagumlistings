"use client"

// components
import Marquee from "@/components/shared/marquee"

// utils
import { motion } from "framer-motion"
import Image from "next/image"

// types
import type { StaticImageData } from "next/image"

// assets
import project1 from "@/app/assets/images2/1.jpg"
import project2 from "@/app/assets/images2/2.jpg"
import project3 from "@/app/assets/images2/3.jpg"
import project4 from "@/app/assets/images2/4.jpg"
import project5 from "@/app/assets/images2/5.jpg"
import project6 from "@/app/assets/images2/6.jpg"
import project7 from "@/app/assets/images2/7.png"

interface Project {
  id: number
  image: StaticImageData
  alt: string
}

const projectsFirstRow: Project[] = [
  { id: 1, image: project1, alt: "Project 1" },
  { id: 2, image: project2, alt: "Project 2" },
  { id: 3, image: project3, alt: "Project 3" },
  { id: 4, image: project4, alt: "Project 4" },
  { id: 5, image: project5, alt: "Project 5" },
  { id: 6, image: project6, alt: "Project 6" },
  { id: 7, image: project7, alt: "Project 7" },
]

const Projects = () => {
  return (
    <section className="relative mt-32 mb-10 w-full overflow-hidden">
      <div className="container relative mx-auto px-4 flex flex-col items-center justify-center">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl font-bold text-green-500 dark:text-white md:text-5xl lg:text-6xl">
            Our Partnerships
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full overflow-hidden">
            <Marquee pauseOnHover className="h-[250px]" applyMask={false}>
              {projectsFirstRow.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative mx-4 h-[220px] w-[330px] overflow-hidden rounded-2xl shadow-lg border border-slate-200/10"
                >
                  <div className="absolute inset-0 z-10" />
                  <Image
                    src={project.image}
                    alt={project.alt}
                    className="object-cover transition-all duration-500 hover:scale-110 h-full w-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
                  />
                </motion.div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
