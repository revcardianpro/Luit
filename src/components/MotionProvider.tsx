"use client";

import { MotionConfig } from "motion/react";

/**
 * Wraps the app so every Motion animation, anywhere on the site,
 * automatically respects the visitor's OS-level "reduce motion"
 * preference — set once here rather than remembering to handle it in
 * every individual animated component.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
