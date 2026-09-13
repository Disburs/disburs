"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Fade-and-rise into view, once — driven by CSS transitions (see `.reveal` in
 * globals.css), not a JS animation library.
 *
 * Robust by construction: the hidden state only applies under `.js` (set by an
 * inline script on the page), so server HTML, no-JS clients and
 * prefers-reduced-motion users always see content. With JS, an
 * IntersectionObserver adds `.in` when the element scrolls into view;
 * `immediate` triggers on mount (used for the hero).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (immediate) {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
