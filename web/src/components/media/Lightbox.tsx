"use client";

import { useEffect, useRef } from "react";
import { HeroImage } from "@/components/media/HeroImage";

export function Lightbox({
  open,
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev?.();
      if (event.key === "ArrowRight") onNext?.();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button type="button" className="absolute inset-0 cursor-zoom-out" aria-label="Close image" onClick={onClose} />
      <div className="relative aspect-[16/10] w-full max-w-5xl">
        <HeroImage src={src} alt={alt} />
      </div>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 min-h-11 min-w-11 bg-cream px-3 text-sm font-semibold uppercase"
      >
        Close
      </button>
    </div>
  );
}
