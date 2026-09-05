import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageBlur } from "@/lib/images";

export function HeroImage({
  src,
  alt,
  priority = false,
  className,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={imageBlur}
      className={cn("object-cover", className)}
    />
  );
}
