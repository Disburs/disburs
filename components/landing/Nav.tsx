"use client";

import { useEffect, useRef, useState } from "react";
import Wordmark from "@/components/Wordmark";
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

export function Logo({ tone = "light" }: { tone?: "dark" | "light" }) {
  return (
    <a href="#top" aria-label="Disburs home" className={`text-[24px] font-semibold tracking-[-0.03em] ${tone === "dark" ? "text-white" : "text-ink"}`}>
      <Wordmark />
    </a>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const skipFocusOnClose = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open && wasOpen.current && !skipFocusOnClose.current) {
      menuButtonRef.current?.focus();
    }

    if (skipFocusOnClose.current) {
      skipFocusOnClose.current = false;
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <header className={`fixed inset-x-0 top-0 z-50 bg-canvas transition-[border-color] duration-200 ${scrolled || open ? "border-b border-line" : "border-b border-transparent"}`}>
      <Container className="flex h-[88px] items-center justify-between">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[17px] text-ink transition-opacity duration-150 hover:opacity-[0.84]">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden h-12 cursor-pointer items-center rounded-full bg-ink-deep px-7 text-[16px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98] sm:inline-flex"
          >
            Join waitlist
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center text-ink lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
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
            className="border-t border-line bg-canvas lg:hidden"
          >
            <Container className="flex flex-col py-4">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => { skipFocusOnClose.current = true; setOpen(false); }} className="flex h-14 items-center border-b border-line text-[18px] text-ink last:border-0">
                  {l.label}
                </a>
              ))}
              <a href="#waitlist" onClick={() => { skipFocusOnClose.current = true; setOpen(false); }} className="mt-5 inline-flex h-14 items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white">
                Join waitlist
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
