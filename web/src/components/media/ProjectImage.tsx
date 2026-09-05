import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageBlur } from "@/lib/images";

export function ProjectImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={imageBlur}
      className={cn("object-cover", className)}
    />
  );
}
