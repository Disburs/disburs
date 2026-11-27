/**
 * The Disburs mark: one bar (the treasury) with payments going out from it,
 * which together read as a D. Drawn dark on a mint tile, so it works on light
 * and dark backgrounds alike. Sized by the surrounding text (1em = font size).
 *
 * The same shapes are in lib/logo-image.tsx (favicon and share card) and
 * brand/generate.mjs (social kit). Change all three together.
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`h-[1.2em] w-[1.2em] shrink-0 ${className}`}
    >
      <rect width="100" height="100" rx="24" fill="#12FF80" />
      <rect x="27" y="24" width="8" height="52" rx="4" fill="#08110D" />
      <path
        d="M45 24 A26 26 0 0 1 45 76"
        fill="none"
        stroke="#08110D"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M45 39 A11 11 0 0 1 45 61"
        fill="none"
        stroke="#08110D"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
