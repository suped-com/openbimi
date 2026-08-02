import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", background: "#faf8f1", color: "#3148d8" }}>
      <BrandMark style={{ width: "52px", height: "42px" }} />
    </div>,
    size,
  );
}
