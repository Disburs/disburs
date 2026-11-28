import { ImageResponse } from "next/og";
import { markImage } from "@/lib/logo-image";

/** Favicon: the Disburs mark, dark on mint. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(markImage(64, 14), size);
}
