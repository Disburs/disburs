import Image from "next/image";

/** The USDC asset mark, for anywhere a USDC balance or amount is shown. */
export default function UsdcMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return <Image src="/logos/usdc.svg" alt="USDC" width={size} height={size} className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size }} />;
}
