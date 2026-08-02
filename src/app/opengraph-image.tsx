import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const alt = "OpenBIMI — Put your brand in the inbox";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const checks = [
  ["BIMI", "#dff6e8"],
  ["VMC", "#dff6e8"],
  ["SVG", "#dff6e8"],
  ["DNS", "#fff1c4"],
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#faf8f1",
        color: "#151819",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ position: "absolute", width: 550, height: 550, right: 20, top: 38, border: "2px solid #f2d77e", borderRadius: 275, opacity: 0.7 }} />
      <div style={{ position: "absolute", width: 390, height: 390, right: 100, top: 118, border: "2px solid #f2d77e", borderRadius: 195, opacity: 0.7 }} />

      <div style={{ display: "flex", flexDirection: "column", width: 610, padding: "70px 0 58px 62px" }}>
        <div style={{ display: "flex", alignItems: "center", color: "#3148d8" }}>
          <BrandMark style={{ width: 76, height: 76 }} />
          <div style={{ marginLeft: 18, color: "#151819", fontSize: 51, fontWeight: 800, letterSpacing: -2 }}>OpenBIMI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 42, fontSize: 88, lineHeight: 0.98, fontWeight: 850, letterSpacing: -5 }}>
          <span>Put your</span>
          <span>brand in</span>
          <span>the inbox<span style={{ color: "#ff6c3b" }}>.</span></span>
        </div>
        <div style={{ display: "flex", marginTop: 30, color: "#3148d8", fontSize: 28, fontWeight: 700 }}>
          Free <span style={{ margin: "0 13px", color: "#ff6c3b" }}>•</span> Open source <span style={{ margin: "0 13px", color: "#ff6c3b" }}>•</span> No account
        </div>
      </div>

      <div style={{ position: "absolute", right: 40, top: 155, display: "flex", flexDirection: "column", width: 540, height: 350, border: "1px solid #e6e1d8", borderRadius: 24, background: "white", boxShadow: "0 18px 45px rgba(30,40,60,0.14)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 76, padding: "0 24px", borderBottom: "1px solid #e6e1d8" }}>
          <span style={{ width: 38, height: 38, borderRadius: 19, background: "#efedf0" }} />
          <span style={{ width: 86, height: 14, marginLeft: 18, borderRadius: 7, background: "#dedde0" }} />
          <span style={{ width: 86, height: 14, marginLeft: 20, borderRadius: 7, background: "#dedde0" }} />
        </div>
        <div style={{ display: "flex", flex: 1, padding: "22px 22px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 360 }}>
            <div style={{ display: "flex", alignItems: "center", height: 82 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, border: "2px solid #f2cf62", borderRadius: 36, background: "#fffdf8", color: "#3148d8" }}>
                <BrandMark style={{ width: 50, height: 50 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
                <span style={{ width: 126, height: 15, borderRadius: 8, background: "#aaa9ae" }} />
                <span style={{ width: 196, height: 12, marginTop: 14, borderRadius: 6, background: "#dedde0" }} />
              </div>
            </div>
            {[0, 1, 2].map((row) => (
              <div key={row} style={{ display: "flex", alignItems: "center", height: 72, borderTop: "1px solid #ece9e4" }}>
                <span style={{ width: 38, height: 38, borderRadius: 19, background: "#efedf0" }} />
                <span style={{ width: row === 1 ? 145 : 170, height: 12, marginLeft: 18, borderRadius: 6, background: "#d7d6d9" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, width: 120, marginLeft: 12, paddingTop: 8 }}>
            {checks.map(([label, background], index) => (
              <div key={label} style={{ display: "flex", alignItems: "center", height: 46, padding: "0 12px", borderRadius: 10, background, fontSize: 17, fontWeight: 750 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, marginRight: 9, borderRadius: 10, background: index === 3 ? "#f2c85e" : "#22b46c" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: "white" }} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
