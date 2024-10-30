"use client"

// components
import { Button as UIButton } from "@/components/ui/button"
import WaveReveal from "@/components/shared/wave-reveal"
import TypingText from "@/components/shared/typing-text"
import { Input } from "@/components/ui/input"

// assets
import logo from "@/app/assets/icons/logo_2.png"
import image2 from "@/app/assets/images/2.jpg"
import image1 from "@/app/assets/images/1.jpg"
import image3 from "@/app/assets/images/3.png"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

// utils
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

// ImageWithWave Component
function ImageWithWave() {
  return (
    <div className="relative inline-block self-center md:self-start">
      <Image
        width={100}
        height={100}
        src={logo}
        className="-top-6 h-10 w-10 translate-y-5 animate-fadeIn fade-in-0 md:-top-10 md:h-16 md:w-16 md:translate-y-0"
        alt="Hero icon"
      />
      <WaveReveal
        className="my-4 pl-[0px] text-green-500 dark:text-white sm:text-[60px] md:px-0 md:text-[70px] lg:text-[80px]"
        text="TagumListings"
      />
    </div>
  )
}

// CardLabel Component
function CardLabel({ text }: { text: string }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 mx-4">
      <div className="flex w-full justify-center rounded-xl bg-slate-800/60 p-2 backdrop-blur-sm">
        <TypingText
          repeat={false}
          className="w-full self-start text-white font-semibold"
          text={text}
        />
      </div>
    </div>
  )
}

// Card Component
function Card({
  card,
  index,
  stackAlign,
}: { card: string; index: number; stackAlign: boolean }) {
  const cardContent = () => {
    switch (card) {
      case "card1":
        return (
          <div className="relative h-full w-full">
            <Image
              src={image1}
              alt=""
              fill
              className="object-cover rounded-2xl"
              priority
            />
            <CardLabel text="Beautiful" />
          </div>
        )
      case "card2":
        return (
          <div className="relative h-full w-full">
            <Image
              src={image2}
              alt=""
              fill
              className="object-cover rounded-2xl"
              priority
            />
            <CardLabel text="Designed" />
          </div>
        )
      case "card3":
        return (
          <div className="relative h-full w-full">
            <Image
              src={image3}
              alt=""
              fill
              className="object-cover rounded-2xl"
              priority
            />
            <CardLabel text="Homes" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      style={{
        boxShadow: index !== 2 ? "inset 0px -10px 30px 0px #1e293b" : "none",
      }}
      key={index}
      className={cn(
        `-mt-20 absolute inset-0 text-center text-gray-800 z-${index} ${card} my-6 flex h-full w-full flex-col items-center justify-around rounded-2xl transition-all duration-700 ease-out overflow-hidden`,
        card === "card1" && stackAlign && "ml-8 md:ml-0",
        card === "card2" &&
          (!stackAlign ? "-rotate-[15deg]" : "-left-8 ml-8 rotate-0 md:ml-0"),
        card === "card3" &&
          (!stackAlign ? "rotate-[15deg]" : "-left-16 ml-8 rotate-0 md:ml-0"),
        index === 0 && "scale-90 bg-slate-900",
        index === 1 && "scale-95 bg-slate-700",
        index === 2 && `scale-100 bg-slate-500 ${stackAlign && "bg-slate-600"}`,
      )}
    >
      <div className="h-full w-full">{cardContent()}</div>
    </div>
  )
}

// InfoContainer Component
function InfoContainer({
  changeStackAlign,
}: { changeStackAlign: (card: string) => void }) {
  const [showChatInput, setShowChatInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleChatNowClick = () => {
    setShowChatInput(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  }

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const underlinedWord = (text: string, card: string) => (
    <span
      onMouseOver={() => changeStackAlign(card)}
      onFocus={() => changeStackAlign(card)}
      className="cursor-pointer text-green-500 font-semibold hover:font-bold"
    >
      {text}
    </span>
  )

  return (
    <div className="flex flex-col items-center md:w-[60%] md:items-start">
      <ImageWithWave />
      <p className="mt-5 w-full animate-fadeIn text-center text-lg leading-8 dark:text-white md:w-[80%] md:text-left">
        We offer the most affordable house and lot with good quality and
        services. {underlinedWord("Beautifully", "card1")},{" "}
        {underlinedWord("Designed", "card2")},{" "}
        {underlinedWord("Homes", "card3")} brought by RME Real Estate Brokerage.
      </p>
      <div className="mt-6 flex animate-fadeIn justify-center gap-2 md:justify-start">
        <AnimatePresence mode="wait">
          {!showChatInput ? (
            <motion.div
              key="button"
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <UIButton
                onClick={handleChatNowClick}
                className="h-10 sm:h-8 w-full sm:w-36 bg-gradient-to-br from-green-950 to-blue-950 dark:from-green-500 dark:to-green-900 border border-green-900 dark:border-green-300 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span className="text-sm">Search property</span>
                <motion.span
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  &rarr;
                </motion.span>
              </UIButton>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial="initial"
              animate="animate"
              variants={inputVariants}
              className="w-full max-w-md"
            >
              <form onSubmit={handleSearch} className="w-full">
                <Input
                  type="text"
                  placeholder="Search property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-black dark:text-white bg-white dark:bg-gradient-to-br from-green-950 to-blue-950 border border-green-900 dark:border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// HeroSection Component
function HeroSection({ className }: { className?: string }) {
  const [stackAlign, setStackAlign] = useState(false)
  const [cardStack, setCardStack] = useState(["card3", "card2", "card1"])

  const cardStacks: { [key: string]: string[] } = {
    card1: ["card3", "card2", "card1"],
    card2: ["card3", "card1", "card2"],
    card3: ["card1", "card2", "card3"],
  }

  const changeStackAlign = (card: string) => {
    setStackAlign(true)
    const newStack = cardStacks[card]
    if (newStack) {
      setCardStack(newStack)
    }
  }

  return (
    <div className={cn(className)}>
      <div className="inner-container m-auto flex h-full w-[90%] flex-col items-center justify-around  md:flex-row">
        <InfoContainer changeStackAlign={changeStackAlign} />
        <div className="flex animate-fadeIn items-center justify-center md:m-0 md:w-[40%]">
          <div className="cards relative flex h-[350px] w-[280px] items-center justify-between md:h-[350px] md:w-[300px]">
            {cardStack.map((card: string, index: number) => (
              <Card
                key={index}
                card={card}
                index={index}
                stackAlign={stackAlign}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
