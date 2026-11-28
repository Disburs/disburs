/**
 * The Disburs mark for generated images (favicon, home-screen icon, share
 * card). Same shapes as components/LogoMark.tsx, without Tailwind classes,
 * because the image renderer only reads inline styles.
 */
export function markImage(size: number, radius: number) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        background: "#12FF80",
        borderRadius: radius,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
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
    </div>
  );
}
