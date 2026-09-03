import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MV Design — Des sites que l’on ne fait pas défiler. On les traverse.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(135deg, #030817 0%, #0a1740 60%, #123BC7 140%)",
          color: "#F4F0E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#C8A96B", fontFamily: "sans-serif" }}>MV DESIGN · STUDIO DIGITAL</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, marginTop: 24, maxWidth: 1000 }}>Des sites que l’on ne fait pas défiler. On les traverse.</div>
        <div style={{ display: "flex", fontSize: 26, marginTop: 28, color: "#98A2B7", fontFamily: "sans-serif" }}>Huit univers. Huit langages visuels. Une même exigence.</div>
      </div>
    ),
    size,
  );
}
