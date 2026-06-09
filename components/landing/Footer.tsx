"use client";

import { Twitter, Linkedin, Github } from "lucide-react";

const COLUMNS: { header: string; links: string[] }[] = [
  {
    header: "Product",
    links: ["How it Works", "Features", "Pricing", "Changelog", "Roadmap"],
  },
  {
    header: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    header: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Security",
      "Cookie Policy",
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="px-5 md:px-10"
      style={{
        background: "#1A1A1A",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "48px",
        paddingBottom: "32px",
      }}
    >
      <div className="mx-auto max-w-container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-medium" style={{ fontSize: "20px", color: "#FFFFFF" }}>
              disburs<span style={{ color: "#12FF80" }}>.</span>
            </span>
            <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "12px" }}>
              The payroll agent for Africa.
            </p>
            <div className="mt-4 flex items-center gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="transition-colors"
                  style={{ color: "#8A8F98" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8F98")}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.header}>
              <h4
                className="uppercase"
                style={{
                  fontSize: "12px",
                  color: "#8A8F98",
                  letterSpacing: "0.1em",
                  marginBottom: "16px",
                }}
              >
                {col.header}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors"
                      style={{ fontSize: "14px", color: "#8A8F98" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#FFFFFF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#8A8F98")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#8A8F98" }}>
            © 2026 Disburs Ltd. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/onboarding"
              className="transition-colors"
              style={{ fontSize: "14px", color: "#12FF80" }}
            >
              Employer demo →
            </a>
            <a
              href="/contractor/onboarding"
              className="transition-colors"
              style={{ fontSize: "14px", color: "#12FF80" }}
            >
              Contractor demo →
            </a>
            <span style={{ fontSize: "14px", color: "#8A8F98" }}>
              Built on Stellar · Powered by Claude
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
