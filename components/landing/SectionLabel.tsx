export default function SectionLabel({ children }: { children: string }) {
  return (
    <span
      className="block text-center font-medium uppercase"
      style={{
        fontSize: "12px",
        color: "#12FF80",
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </span>
  );
}
