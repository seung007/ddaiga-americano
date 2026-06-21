import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "뛰다가 아메리카노 — 초보 러너를 위한 러닝화 추천";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 배경 원형 장식 */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "120px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        {/* 태그 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "#6ee7b7", fontSize: "22px", fontWeight: 600 }}>
            🏃 논문 기반 러닝화 추천
          </span>
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            color: "white",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-1px",
          }}
        >
          뛰다가 아메리카노
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            color: "#a7f3d0",
            fontSize: "32px",
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          키·체중·발볼·발 타입으로 찾는<br />
          내 몸에 맞는 러닝화 — 광고 없이, 데이터로만
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "22px",
          }}
        >
          ddaiga-americano.vercel.app
        </div>
      </div>
    ),
    size
  );
}
