/** The Disburs wordmark: the name, with a full stop in the primary colour. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Disburs<span className="text-mint">.</span>
    </span>
  );
}
