import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "60px 20px" }}>
      {/* ===== 메인 섹션 ===== */}
      <main style={{ maxWidth: 850, margin: "0 auto" }}>
        
        {/* 히어로 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <span style={{ 
            fontSize: "14px", 
            fontWeight: 800, 
            color: "#0ea5e9", 
            background: "rgba(14,165,233,0.1)", 
            padding: "8px 20px", 
            borderRadius: "30px",
            border: "1px solid rgba(14,165,233,0.2)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "20px",
            display: "inline-block"
          }}>
            About Us
          </span>
          <h1 style={{ fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, color: "white", marginBottom: "24px", letterSpacing: "-1px" }}>
            용인의 더 나은 일상을 위한<br />
            <span style={{ color: "#0ea5e9" }}>가장 똑똑한 길잡이</span>
          </h1>
          <p style={{ fontSize: "20px", color: "#94a3b8", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto" }}>
            '용인시 생활 정보'는 흩어져 있는 지역 소식을 AI 기술로 정제하여 주민들에게 실질적인 가치를 전달합니다.
          </p>
        </div>

        {/* 핵심 섹션 1: 운영 목적 */}
        <section style={{ 
          marginBottom: "40px", 
          background: "rgba(255, 255, 255, 0.05)", 
          backdropFilter: "blur(20px)", 
          padding: "48px", 
          borderRadius: "40px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
        }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "24px", color: "white", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "32px" }}>🎯</span> 운영 목적
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "18px", lineHeight: 1.9, wordBreak: "keep-all" }}>
            우리는 주민들이 복잡한 행정 사이트를 일일이 뒤지지 않아도 **자신에게 꼭 필요한 혜택과 소식**을 놓치지 않기를 바랍니다. <br /><br />
            '용인시 생활 정보'는 어려운 법적/행정 용어를 누구나 이해할 수 있는 친근한 언어로 번역하고, 핵심 내용만 선별하여 가장 빠르게 전달하는 것을 미션으로 삼고 있습니다.
          </p>
        </section>

        {/* 핵심 섹션 2: 데이터 신뢰성 */}
        <section style={{ 
          marginBottom: "40px", 
          background: "rgba(255, 255, 255, 0.03)", 
          backdropFilter: "blur(20px)", 
          padding: "48px", 
          borderRadius: "40px", 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)"
        }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "24px", color: "white", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "32px" }}>📊</span> 데이터의 신뢰성
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "18px", lineHeight: 1.9 }}>
            모든 정보는 대한민국 정부가 운영하는 **공공데이터포털(data.go.kr)**의 검증된 API 데이터를 기반으로 합니다. <br /><br />
            수집된 원시 데이터는 최첨단 AI 큐레이션 시스템을 거쳐 중복된 정보를 제거하고, 사용자의 관점에서 가장 중요한 내용(신청 기한, 대상, 혜택 등)을 중심으로 재구성되어 제공됩니다.
          </p>
        </section>

        {/* 약속 섹션 (강조박스) */}
        <section style={{ 
          marginBottom: "60px", 
          background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", 
          padding: "50px", 
          borderRadius: "40px", 
          color: "white", 
          boxShadow: "0 20px 40px -10px rgba(14, 165, 233, 0.5)" 
        }}>
          <h2 style={{ fontSize: "30px", fontWeight: 900, marginBottom: "30px", color: "white" }}>🛡️ 우리의 세 가지 약속</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" }}>
            <div>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</p>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "10px" }}>정확성</h3>
              <p style={{ fontSize: "15px", opacity: 0.9, lineHeight: 1.6 }}>검증된 공식 출처만을 활용하여 왜곡 없는 정보를 제공합니다.</p>
            </div>
            <div>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>🚀</p>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "10px" }}>신속성</h3>
              <p style={{ fontSize: "15px", opacity: 0.9, lineHeight: 1.6 }}>매일 새벽 자동 업데이트 시스템으로 가장 따끈한 소식을 전합니다.</p>
            </div>
            <div>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>🤝</p>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "10px" }}>공익성</h3>
              <p style={{ fontSize: "15px", opacity: 0.9, lineHeight: 1.6 }}>영리보다는 지역 공동체의 정보 격차 해소를 최우선 가치로 둡니다.</p>
            </div>
          </div>
        </section>

        <div style={{ textAlign: "center", paddingBottom: "60px" }}>
          <p style={{ fontSize: "16px", color: "#64748b", fontStyle: "italic" }}>
            "용인 시민의 더 나은 일상을 위해, 우리는 오늘도 데이터를 읽고 가치를 씁니다."
          </p>
          <div style={{ marginTop: "30px" }}>
             <Link href="/" style={{ color: "#0ea5e9", fontWeight: 800, textDecoration: "none", fontSize: "16px" }}>
                홈으로 돌아가기 →
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
