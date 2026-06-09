"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Who We Serve", href: "#who-we-serve" },
  { label: "Waitlist", href: "#waitlist" },
];

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="font-medium"
      style={{ fontSize: "20px", color: dark ? "#FFFFFF" : "#1A1A1A" }}
    >
      disburs
      <span style={{ color: "#12FF80" }}>.</span>
    </span>
  );
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        height: "81px",
        background: scrolled ? "#FFFFFF" : "transparent",
        borderBottom: scrolled ? "1px solid #E8E8E8" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-full max-w-container items-center justify-between px-5 md:px-10">
        {/* Left: wordmark */}
        <a href="#top" aria-label="Disburs home">
          <Wordmark />
        </a>

        {/* Center: nav links (desktop) */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-normal transition-colors hover:text-mint"
              style={{ fontSize: "16px", color: "#1A1A1A" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: actions (desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#waitlist"
            className="flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
            style={{
              height: "40px",
              padding: "8px 16px",
              borderRadius: "4px",
              background: "#12FF80",
              color: "#1A1A1A",
              fontSize: "14px",
              boxShadow: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
            }}
          >
            Join the Waitlist
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={24} color="#1A1A1A" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-[280px] flex-col bg-white lg:hidden"
              style={{ borderLeft: "1px solid #E8E8E8" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div
                className="flex items-center justify-between px-5"
                style={{ height: "81px" }}
              >
                <Wordmark />
                <button aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X size={24} color="#1A1A1A" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-2 px-5 pt-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="py-3 font-normal transition-colors hover:text-mint"
                    style={{ fontSize: "18px", color: "#1A1A1A" }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="p-5">
                <a
                  href="#waitlist"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center font-medium"
                  style={{
                    height: "48px",
                    borderRadius: "4px",
                    background: "#12FF80",
                    color: "#1A1A1A",
                    fontSize: "16px",
                    boxShadow: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
                  }}
                >
                  Join the Waitlist
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
