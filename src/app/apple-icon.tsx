import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b91c2c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 120,
            background: "#f5f3f1",
            border: "8px solid #d9a93e",
          }}
        >
          <div style={{ display: "flex", width: 44, height: 44, borderRadius: 44, background: "#b91c2c" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
