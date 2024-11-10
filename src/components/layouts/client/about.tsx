"use client"

import { motion } from "framer-motion"

import type { FC } from "react"

interface EPCDetails {
  letter: string
  name: string
  description: string
}

const epcDetails: EPCDetails[] = [
  {
    letter: "E",
    name: "Elvie Tabale",
    description: "Owner",
  },
  {
    letter: "P",
    name: "Pauline Alexandria Go",
    description: "File Assistant",
  },
  {
    letter: "C",
    name: "Charme Cahapay Royo",
    description: "Agent",
  },
]

const About: FC = () => {
  return (
    <section className="w-full mt-32 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-7xl font-bold text-green-500 dark:text-white mb-8">
            About Us
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-lg dark:text-white">
                Located at Door 5, NTA building, Magsaysay st. near Corner
                Osmeña st. Brgy, Magugpo Poblacion, Tagum City, we strive to
                provide the best real estate solutions for our clients.
              </p>
              <p className="text-lg dark:text-white">
                Our mission is to help people make informed decisions about real
                estate investments and provide solutions for everyone's dream of
                owning a home.
              </p>
            </motion.div>

            {/* RME Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="space-y-4">
                {epcDetails.map((detail, index) => (
                  <motion.div
                    key={detail.letter}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                    className={`bg-white dark:bg-slate-700 rounded-xl p-6 shadow-lg ${
                      index === 0 ? "ml-0" : index === 1 ? "ml-4" : "ml-8"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-green-500 font-bold text-2xl dark:text-white">
                          {detail.name}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {detail.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
