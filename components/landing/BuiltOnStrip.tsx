const PARTNERS = ["Stellar", "USDC", "Circle", "Claude"];

export default function BuiltOnStrip() {
  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "32px", paddingBottom: "40px" }}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-5">
        <span
          className="font-medium uppercase"
          style={{ fontSize: "12px", color: "#8A8F98", letterSpacing: "0.1em" }}
        >
          Built on
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="font-medium"
              style={{ fontSize: "20px", color: "#8A8F98" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
