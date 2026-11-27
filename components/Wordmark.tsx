import LogoMark from "@/components/LogoMark";

/** The Disburs logo: the mark, then the name with a full stop in the primary colour. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.4em] ${className}`}>
      <LogoMark />
      <span>
        Disburs<span className="text-mint">.</span>
      </span>
    </span>
  );
}
