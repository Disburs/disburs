const LOGOS = [
  { src: "/logos/usdc.svg", label: "USDC" },
  { src: "/logos/stellar.svg", label: "Stellar" },
  { src: "/logos/circle.svg", label: "Circle" },
];

// Just enough to span a wide row; the track is rendered twice for a
// seamless loop, so keep the repeat count low to avoid a crowded strip.
const TRACK = Array.from({ length: 3 }, () => LOGOS).flat();

function Logo({ src, label }: { src: string; label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3" style={{ opacity: 0.72 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${label} logo`} width={30} height={30} style={{ height: "30px", width: "30px" }} />
      <span
        className="font-medium"
        style={{ fontSize: "19px", color: "#5B6169", letterSpacing: "-0.01em" }}
      >
        {label}
      </span>
    </span>
  );
}

export default function BuiltOnStrip() {
  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "32px", paddingBottom: "40px" }}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-6">
        <span
          className="font-medium uppercase"
          style={{ fontSize: "12px", color: "#8A8F98", letterSpacing: "0.12em" }}
        >
          Built on
        </span>

        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="marquee marquee--ltr flex w-max items-center gap-x-20">
            {TRACK.map((logo, i) => (
              <Logo key={`a-${i}`} {...logo} />
            ))}
            {TRACK.map((logo, i) => (
              <Logo key={`b-${i}`} {...logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
