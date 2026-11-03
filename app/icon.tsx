import { ImageResponse } from "next/og";

/** Favicon: the Disburs mark, a serif D on near-black green. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E1A14",
        borderRadius: 14,
        color: "#12FF80",
        fontSize: 44,
        fontWeight: 700,
        fontFamily: "serif",
      }}
    >
      D
    </div>,
    size,
  );
}
