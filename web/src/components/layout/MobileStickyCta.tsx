"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { telHref } from "@/content/site";
import { track } from "@/lib/analytics";

export function MobileStickyCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/start-your-project") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone bg-cream/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={telHref()}
          onClick={() => track("phone_clicked")}
          className="inline-flex min-h-12 items-center justify-center border border-ink/15 text-sm font-semibold uppercase tracking-wide"
        >
          Call
        </a>
        <Link
          href="/start-your-project"
          className="inline-flex min-h-12 items-center justify-center bg-forest text-sm font-semibold uppercase tracking-wide text-cream"
        >
          Start project
        </Link>
      </div>
    </div>
  );
}
