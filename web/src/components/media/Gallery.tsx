"use client";

import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import { ProjectImage } from "@/components/media/ProjectImage";

export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              className="relative aspect-[16/10] w-full overflow-hidden bg-stone"
              onClick={() => setOpen(index)}
              aria-label={`Open image: ${image.alt}`}
            >
              <ProjectImage src={image.src} alt={image.alt} />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        open={open !== null}
        src={images[open ?? 0]?.src ?? ""}
        alt={images[open ?? 0]?.alt ?? ""}
        onClose={() => setOpen(null)}
        onPrev={() => setOpen((value) => (value === null ? 0 : (value + images.length - 1) % images.length))}
        onNext={() => setOpen((value) => (value === null ? 0 : (value + 1) % images.length))}
      />
    </>
  );
}
