import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RakhiBox — design a 3D rakhi and send a gift-box moment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8f1422 0%, #b91c2c 55%, #e23a48 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "rgba(217,169,62,0.25)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -140,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(0,0,0,0.18)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 168,
            height: 168,
            borderRadius: 168,
            background: "#f5f3f1",
            border: "10px solid #d9a93e",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 64,
              background: "#b91c2c",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#f5f3f1",
            letterSpacing: -1,
          }}
        >
          RakhiBox
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 32,
            color: "#f3e4e6",
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          Design your own 3D rakhi and send a gift-box moment
        </div>
      </div>
    ),
    { ...size }
  );
}
