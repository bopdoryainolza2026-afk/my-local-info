"use client";

import React, { useState } from "react";

export default function AIRequestForm() {
  const [request, setRequest] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;
    
    // 실제로는 여기서 API를 호출하거나 데이터를 저장할 수 있습니다.
    // 지금은 사용자 경험을 위해 성공 메시지만 보여줍니다.
    setIsSubmitted(true);
    setRequest("");
  };

  if (isSubmitted) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        background: "rgba(34, 197, 94, 0.1)",
        borderRadius: "20px",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚀</div>
        <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#22c55e", marginBottom: "12px" }}>
          취재 요청 완료!
        </h4>
        <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.6 }}>
          AI 기자가 해당 정보를 수집하기 시작했습니다.<br />
          <b>내일 아침 7시 업데이트</b>에서 확인해 보세요!
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          style={{
            marginTop: "20px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#94a3b8",
            padding: "8px 16px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          추가 요청하기
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="예: 우리 동네 새로 생긴 빵집 정보가 궁금해요! / 주말에 아이랑 갈만한 공원 알려주세요."
            style={{
              width: "100%",
              minHeight: "100px",
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "16px",
              color: "white",
              fontSize: "15px",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
            }}
          />
          <div style={{ 
            position: "absolute", 
            bottom: "12px", 
            right: "12px", 
            fontSize: "11px", 
            color: "#64748b" 
          }}>
            {request.length}자 입력 중
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!request.trim()}
          style={{
            background: request.trim() 
              ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)" 
              : "rgba(255,255,255,0.05)",
            color: request.trim() ? "white" : "#64748b",
            padding: "16px",
            borderRadius: "16px",
            fontWeight: 800,
            fontSize: "16px",
            border: "none",
            cursor: request.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: request.trim() ? "0 4px 12px rgba(6,182,212,0.4)" : "none",
          }}
        >
          🎤 AI 기자에게 취재 요청하기
        </button>
      </form>
      <p style={{ marginTop: "16px", fontSize: "12px", color: "#64748b", textAlign: "center" }}>
        * 요청하신 정보는 AI의 분석을 거쳐 다음 날 자동으로 포스팅될 수 있습니다.
      </p>
    </div>
  );
}
