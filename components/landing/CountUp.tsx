"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.1,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}
