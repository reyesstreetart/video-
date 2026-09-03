import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030817",
          color: "#F4F0E8",
          fontSize: 30,
          fontFamily: "Georgia, serif",
          borderRadius: 32,
          border: "2px solid #C8A96B",
          letterSpacing: -2,
        }}
      >
        MV
      </div>
    ),
    size,
  );
}
