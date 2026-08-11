"use client";

import { Paperclip, Send } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const EXAMPLES = [
  "Pay October salary",
  "Add a bonus for Laycon",
  "Why was Amara underpaid?",
];

export default function ChatSection() {
  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Natural Language</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "600px",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              lineHeight: 1.1,
            }}
          >
            Just ask. The agent does the rest.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            No forms. No spreadsheets. Type what you want in plain English. The
            agent reads, calculates, and pays.
          </p>
        </FadeIn>

        {/* Framed chat composer */}
        <FadeIn>
          <div
            className="mx-auto mt-12"
            style={{
              maxWidth: "720px",
              background: "#DEF6E9",
              borderRadius: "24px",
              padding: "10px",
            }}
          >
            <div
              className="bg-white"
              style={{ borderRadius: "18px", padding: "20px" }}
            >
              {/* Conversation */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <div
                    style={{
                      background: "#F5F5F5",
                      color: "#1A1A1A",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      maxWidth: "85%",
                    }}
                  >
                    How much did we spend on payroll last month?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    style={{
                      background: "#DEF6E9",
                      color: "#0A9200",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      maxWidth: "85%",
                    }}
                  >
                    $11,940 across 14 contractors, 3.2% less than September
                    thanks to a better FX window. ✓
                  </div>
                </div>
              </div>

              {/* Composer */}
              <div
                className="mt-4 flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid #E8E8E8" }}
              >
                <Paperclip size={20} color="#8A8F98" />
                <span
                  className="flex-1"
                  style={{ fontSize: "14px", color: "#1A1A1A" }}
                >
                  Pay the design team October salary plus a bonus for Laycon
                  <span className="typing-cursor">|</span>
                </span>
                <button
                  aria-label="Send"
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    background: "#12FF80",
                  }}
                >
                  <Send size={18} color="#1A1A1A" />
                </button>
              </div>
            </div>
          </div>

          {/* Example prompt chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {EXAMPLES.map((e) => (
              <span
                key={e}
                style={{
                  background: "#F5F5F5",
                  border: "1px solid #E8E8E8",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "#8A8F98",
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
