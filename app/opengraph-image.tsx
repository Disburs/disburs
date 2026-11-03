import { ImageResponse } from "next/og";

/**
 * The share card X, LinkedIn, Slack and WhatsApp show for disburs.xyz.
 * Generated at build time; Next adds the og:image and twitter:image tags.
 */
export const alt =
  "Disburs: stablecoin payroll that keeps every salary private";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Playfair Display from Google Fonts; falls back to the built-in font if offline. */
async function playfair(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.(?:ttf|woff))\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const font = await playfair();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#0E1A14",
        color: "#FFFFFF",
        fontFamily: font ? "Playfair" : "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        Disburs
        <span style={{ color: "#12FF80" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            maxWidth: 1000,
          }}
        >
          Stablecoin payroll that keeps every salary private.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 28,
            color: "#B7C4BC",
            fontFamily: "sans-serif",
          }}
        >
          <span
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              background: "#12FF80",
              color: "#08110D",
              fontWeight: 600,
            }}
          >
            USDC on Stellar
          </span>
          <span>Pay contractors anywhere · disburs.xyz</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: "Playfair", data: font, weight: 600, style: "normal" }]
        : undefined,
    },
  );
}
