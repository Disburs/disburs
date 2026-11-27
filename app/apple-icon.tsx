import { ImageResponse } from "next/og";
import { markImage } from "@/lib/logo-image";

/** Home-screen icon for phones and tablets. They round the corners themselves. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(markImage(180, 0), size);
}
