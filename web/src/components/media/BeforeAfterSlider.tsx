"use client";

import { useId, useState } from "react";
import { ProjectImage } from "@/components/media/ProjectImage";

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [value, setValue] = useState(50);
  const id = useId();

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-stone">
      <ProjectImage src={beforeSrc} alt={beforeAlt} sizes="(max-width: 1024px) 100vw, 50vw" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${value}%` }}>
        <ProjectImage src={afterSrc} alt={afterAlt} sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-cream" style={{ left: `${value}%` }} />
      <label className="sr-only" htmlFor={id}>
        Compare before and after images
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} percent after image revealed`}
        onChange={(event) => setValue(Number(event.target.value))}
        className="absolute inset-0 cursor-ew-resize opacity-0"
      />
      <span className="absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-xs uppercase tracking-wide">Before</span>
      <span className="absolute bottom-3 right-3 bg-paper/90 px-2 py-1 text-xs uppercase tracking-wide">After</span>
    </div>
  );
}
