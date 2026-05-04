"use client";

import React from "react";

/**
 * 오른쪽에 위치할 광고 전용 사이드바 컴포넌트입니다.
 * 초보자분들이 이해하기 쉽도록 스타일을 한곳에 몰아서 작성했습니다.
 */
export default function RightSidebar() {
  return (
    <aside style={{
      width: "100%",
      maxWidth: "245px", // 272px에서 약 10% 더 축소
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      padding: "0 8px",
    }}>

      {/* 1. 커스텀 추천 광고 (태허철학관 스타일) */}
      <div style={{
        background: "linear-gradient(135deg, rgba(42, 56, 84, 0.7) 0%, rgba(61, 53, 112, 0.7) 100%)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: "20px",
        color: "#f8fafc",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
        textAlign: "center",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <div style={{
          fontSize: "11px",
          fontWeight: 700,
          background: "rgba(255,255,255,0.1)",
          padding: "4px 10px",
          borderRadius: "12px",
          display: "inline-block",
          marginBottom: "16px",
          color: "#94a3b8"
        }}>
          ✨ 추천 서비스
        </div>

        <div style={{
          width: "80px",
          height: "80px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          📜
        </div>

        <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>
          우리학전 철학관
        </h4>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px", lineHeight: 1.5 }}>
          사주 · 운세 · 작명 전문 상담<br />
          마음이 답답할 때 찾아오세요.
        </p>

        <a href="#" style={{
          display: "block",
          background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
          color: "white",
          padding: "10px",
          borderRadius: "30px",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(236,72,153,0.4)",
        }}>
          지금 상담받기 →
        </a>
      </div>

      {/* 2. 일반 추천 상품 (쿠팡 광고 스타일) */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
      }}>
        <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "12px", textAlign: "center" }}>
          🛒 이달의 추천 상품
        </p>

        <div style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "60px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          🎧
        </div>

        <div style={{ marginBottom: "8px" }}>
          <span style={{
            color: "#ef4444",
            fontSize: "16px",
            fontWeight: 800,
            marginRight: "6px"
          }}>
            15%
          </span>
          <span style={{ fontSize: "16px", fontWeight: 800 }}>
            245,000원
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#f8fafc", fontWeight: 600, marginBottom: "12px" }}>
          고급 무선 노이즈캔슬링 헤드셋
        </p>

        <div style={{
          fontSize: "12px",
          color: "#0ea5e9",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          🚀 로켓배송
        </div>
      </div>

      {/* 여기에 나중에 실제 광고(애드센스 등) 코드를 넣을 수 있는 공간 */}
      <div style={{
        padding: "20px",
        border: "1px dashed rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "20px",
        textAlign: "center",
        color: "#cbd5e1",
        fontSize: "13px"
      }}>
        구글 애드센스 광고가<br />들어올 자리입니다.
      </div>

    </aside>
  );
}
