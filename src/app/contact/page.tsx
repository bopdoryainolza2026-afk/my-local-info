import Link from "next/link";

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "60px 20px" }}>
      {/* ===== 메인 컨텐츠 ===== */}
      <main style={{ maxWidth: 850, margin: "0 auto" }}>
        
        {/* 히어로 섹션 */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ 
            fontSize: "14px", 
            fontWeight: 800, 
            color: "#f97316", 
            background: "rgba(249,115,22,0.1)", 
            padding: "8px 20px", 
            borderRadius: "30px",
            border: "1px solid rgba(249,115,22,0.2)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "20px",
            display: "inline-block"
          }}>
            Contact Us
          </span>
          <h1 style={{ fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, color: "white", marginBottom: "24px", letterSpacing: "-1px" }}>
            궁금한 점이 있으신가요?
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8", lineHeight: 1.7 }}>
            서비스 이용 문의, 제휴 제안 등 여러분의 소중한 의견을 기다립니다.<br />
            보내주시는 의견은 하나하나 소중히 검토하겠습니다.
          </p>
        </div>

        {/* 문의 카드 */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.05)", 
          backdropFilter: "blur(20px)", 
          padding: "60px 40px", 
          borderRadius: "40px", 
          border: "1px solid rgba(255, 255, 255, 0.1)", 
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #f97316 0%, #ed64a6 100%)", 
            borderRadius: "24px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "40px", 
            margin: "0 auto 30px",
            boxShadow: "0 10px 20px rgba(249, 115, 22, 0.3)"
          }}>
            📧
          </div>
          <h3 style={{ fontSize: "28px", fontWeight: "900", color: "white", marginBottom: "16px" }}>이메일 문의</h3>
          <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "20px" }}>가장 빠른 답변을 받으실 수 있는 방법입니다.</p>
          
          <a href="mailto:bopdoryainolza2026@gmail.com" style={{ 
            fontSize: "24px", 
            fontWeight: "800", 
            color: "#f97316", 
            textDecoration: "none",
            background: "rgba(249,115,22,0.05)",
            padding: "12px 30px",
            borderRadius: "20px",
            border: "1px solid rgba(249,115,22,0.1)",
            display: "inline-block",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(249,115,22,0.1)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(249,115,22,0.05)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          >
            bopdoryainolza2026@gmail.com
          </a>
          
          <div style={{ 
            marginTop: "50px", 
            padding: "30px", 
            background: "rgba(0, 0, 0, 0.2)", 
            borderRadius: "24px", 
            textAlign: "left",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
               <span style={{ fontSize: "20px" }}>⏱️</span>
               <div>
                  <p style={{ margin: 0, color: "white", fontWeight: 800, fontSize: "15px" }}>답변 가능 시간</p>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>평일 10:00 - 17:00 (토/일/공휴일 휴무)</p>
               </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
               <span style={{ fontSize: "20px" }}>💡</span>
               <div>
                  <p style={{ margin: 0, color: "white", fontWeight: 800, fontSize: "15px" }}>도움말</p>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: 1.5 }}>
                    문의 제목에 <b>[용인포털 문의]</b>를 넣어주시면 더욱 정확하고 빠른 처리가 가능합니다.
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "60px", textAlign: "center" }}>
           <Link href="/" style={{ color: "#64748b", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>
              ← 홈으로 돌아가기
           </Link>
        </div>
      </main>
    </div>
  );
}
