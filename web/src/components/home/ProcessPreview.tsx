"use client";

import { useState } from "react";
import { processPreview } from "@/content/process";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

export function ProcessPreview() {
  const [open, setOpen] = useState(0);

  return (
    <Section className="bg-forest-deep text-cream">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Our process</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">From the first conversation to handover.</h2>
        </div>
        <Button href="/process" variant="secondary">
          See our process
        </Button>
      </div>
      <ol className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {processPreview.map((stage, index) => {
          const expanded = open === index;
          return (
            <li key={stage.n}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="flex w-full items-start gap-6 py-5 text-left"
              >
                <span className="font-display text-2xl text-timber">{stage.n}</span>
                <span className="flex-1">
                  <span className="block font-display text-2xl">{stage.title}</span>
                  <span className="mt-1 block text-sm text-cream/70">{stage.summary}</span>
                  <span
                    className={cn(
                      "grid transition-all duration-300",
                      expanded ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden text-sm leading-6 text-cream/80">{stage.detail}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
