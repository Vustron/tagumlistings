"use client"

// components
import Marquee from "@/components/shared/marquee"

// utils
import { motion } from "framer-motion"
import Image from "next/image"

// types
import type { StaticImageData } from "next/image"

// assets
import project1 from "@/app/assets/images/Picture1.jpg"
import project2 from "@/app/assets/images/Picture2.jpg"
import project3 from "@/app/assets/images/Picture3.jpg"
import project4 from "@/app/assets/images/Picture4.png"
import project5 from "@/app/assets/images/Picture5.jpg"
import project6 from "@/app/assets/images/Picture6.jpg"
import project7 from "@/app/assets/images/Picture7.jpg"
import project8 from "@/app/assets/images/Picture8.jpg"
import project9 from "@/app/assets/images/Picture9.png"
import project10 from "@/app/assets/images/Picture10.jpg"
import project11 from "@/app/assets/images/Picture11.jpg"
import project12 from "@/app/assets/images/Picture12.jpg"
import project13 from "@/app/assets/images/Picture13.jpg"
import project14 from "@/app/assets/images/Picture14.jpg"

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

const projectsSecondRow: Project[] = [
  { id: 8, image: project8, alt: "Project 8" },
  { id: 9, image: project9, alt: "Project 9" },
  { id: 10, image: project10, alt: "Project 10" },
  { id: 11, image: project11, alt: "Project 11" },
  { id: 12, image: project12, alt: "Project 12" },
  { id: 13, image: project13, alt: "Project 13" },
  { id: 14, image: project14, alt: "Project 14" },
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

        <div className="flex flex-col items-center justify-center md:flex-row">
          {/* First Marquee */}
          <div className="w-full overflow-hidden md:w-1/2">
            <Marquee
              vertical
              pauseOnHover
              className="h-[600px]"
              applyMask={false}
            >
              {projectsFirstRow.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative mb-6 h-[200px] w-[400px] overflow-hidden rounded-xl"
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    className="object-cover transition-all duration-700 hover:scale-110 h-[200px] w-[400px]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
                  />
                </motion.div>
              ))}
            </Marquee>
          </div>

          {/* Second Marquee */}
          <div className="w-full overflow-hidden md:w-1/2">
            <Marquee
              vertical
              reverse
              pauseOnHover
              className="h-[600px]"
              applyMask={false}
            >
              {projectsSecondRow.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative mb-6 h-[200px] w-[400px] overflow-hidden rounded-xl"
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    className="object-cover transition-all duration-700 hover:scale-110 h-[200px] w-[400px]"
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
