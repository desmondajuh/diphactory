// app/api/og/route.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "Photography Studio";
  const subtitle = searchParams.get("subtitle") || "Capturing timeless moments";
  const image =
    searchParams.get("image") ||
    "https://www.diphactory.com/images/bg/bride-bg.jpg"; // fallback

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        fontFamily: "sans-serif",
      }}
    >
      {/* 🔥 Background Image */}
      <img
        src={image}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 🔥 Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
        }}
      />

      {/* 🔥 Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          color: "white",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "80%",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            opacity: 0.8,
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            letterSpacing: "2px",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Diai Image Phactory
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
