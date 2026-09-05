"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";

export function UtmCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
