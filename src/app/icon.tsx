import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "32px", background: "#3148d8", color: "white", fontSize: "37px", fontWeight: 800, letterSpacing: "-3px" }}>B</div>,
    size,
  );
}
