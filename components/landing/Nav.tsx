"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "./Section";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#privacy" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/** Wordmark only. */
export function Logo({ tone }: { tone: "dark" | "light" }) {
  return (
    <a
      href="#top"
      aria-label="Disburs home"
      className={`font-display text-[20px] font-semibold tracking-[-0.03em] ${
        tone === "dark" ? "text-white" : "text-ink"
      }`}
    >
      Disburs
    </a>
  );
}

/**
 * Sticky nav that adapts to the surface beneath it: transparent with white
 * text over the dark hero, then a frosted paper bar with ink text once the
 * hero scrolls away.
 */
export default function Nav() {
  const [overHero, setOverHero] = useState(true);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOverHero(e.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  const dark = overHero && !open;
  const tone = dark ? "dark" : "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        dark ? "on-dark border-b border-transparent bg-transparent" : "border-b border-line bg-paper/90 backdrop-blur-md"
      }`}
    >
      <Container className="flex h-[68px] items-center justify-between">
        <Logo tone={tone} />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[14px] transition-colors duration-150 ${
                dark ? "text-white/65 hover:text-white" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className={`hidden h-10 cursor-pointer items-center rounded-md px-4 text-[14px] font-medium transition-colors duration-150 sm:inline-flex ${
              dark ? "bg-mint text-ink-deep hover:bg-[#3dff96]" : "bg-ink text-white hover:bg-[#1a2a22]"
            }`}
          >
            Join the waitlist
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center lg:hidden ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-line bg-paper lg:hidden"
          >
            <Container className="flex flex-col py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center border-b border-line text-[16px] text-ink last:border-0"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#waitlist"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-md bg-ink text-[15px] font-medium text-white"
              >
                Join the waitlist
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
