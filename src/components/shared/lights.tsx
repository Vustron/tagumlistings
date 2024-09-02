// utils
import { cn } from "@/lib/utils"

const Lights = ({ className }: { className?: React.ReactNode }) => (
  <div className={cn("size-full overflow-hidden", className)}>
    <div
      className={"size-full relative bottom-[-200px] "}
      style={{
        background:
          "conic-gradient(from 180deg at 50% 50%,var(--blue-500) 0deg,var(--cyan-400) 180deg,var(--yellow-400) 1turn)",
        filter: "blur(75px)",
        opacity: "20%",
      }}
    />
  </div>
)

export default Lights
