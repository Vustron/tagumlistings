// utils
import { IKImage } from "imagekitio-next"

interface MediaImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: "lazy" | "eager"
  transformation?: Array<{ [key: string]: string }>
}

const MediaImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  transformation = [],
  ...restProps
}: MediaImageProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <IKImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={"lazy"}
        lqip={{ active: true, quality: 20 }}
        transformation={transformation}
        className="size-full object-cover transition-opacity duration-300"
        {...restProps}
      />
    </div>
  )
}

export default MediaImage
