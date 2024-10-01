import { useEffect, useState } from "react"

type FetchScrollProps = {
  topRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore?: boolean
  loadMore?: () => void
  count?: number
}

export const useFetchScroll = ({
  topRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: FetchScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const topDiv = topRef?.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore!()
      }
    }

    topDiv?.addEventListener("scroll", handleScroll)

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll)
    }
  }, [shouldLoadMore, loadMore, topRef])

  useEffect(() => {
    const bottomDiv = bottomRef?.current
    const topDiv = topRef.current
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }

      if (!topDiv) {
        return false
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceFromBottom
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        })
      }, 100)
    }
  }, [bottomRef, topRef, count, hasInitialized])
}
