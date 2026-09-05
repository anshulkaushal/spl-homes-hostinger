"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export function ViewTracker({
  event,
  payload,
}: {
  event: AnalyticsEvent;
  payload?: Record<string, string | undefined>;
}) {
  const encoded = JSON.stringify(payload ?? {});
  useEffect(() => {
    track(event, JSON.parse(encoded) as Record<string, string | undefined>);
  }, [event, encoded]);
  return null;
}
