import Image from "next/image";

interface FloatingStickerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  animationClass?: "animate-float-slow" | "animate-float-medium" | "animate-float-fast";
  delayMs?: number;
}

export default function FloatingSticker({
  src,
  alt,
  width,
  height,
  className = "",
  animationClass = "animate-float-slow",
  delayMs = 0,
}: FloatingStickerProps) {
  return (
    <div 
      className={`absolute pointer-events-none ${animationClass} ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="drop-shadow-lg"
      />
    </div>
  );
}
