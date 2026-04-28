import Link from "next/link";

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* ===== 헤더 ===== */}
      <header style={{
        background: "white",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #e2e8f0",
      }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>
            🏘️ 용인시 생활 정보
          </Link>
          <Link href="/" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>홈으로</Link>
        </div>
      </header>

      {/* ===== 메인 컨텐츠 ===== */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 30 }}>이용약관</h1>
        
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", lineHeight: "1.7", color: "#334155" }}>
          
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>제 1 조 (목적)</h2>
            <p>본 약관은 '용인시 생활 정보' 사이트가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 사이트 운영자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>제 2 조 (정보의 신뢰성)</h2>
            <p>1. 본 사이트는 공공데이터 및 신뢰할 수 있는 소스를 바탕으로 정보를 제공하나, 정보의 완전성이나 최신성을 보장하지는 않습니다. <br />
            2. 이용자는 중요한 사항에 대해 반드시 해당 기관에 직접 확인해야 하며, 사이트 정보를 신뢰하여 발생한 결과에 대해 운영자는 책임을 지지 않습니다.</p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>제 3 조 (서비스의 중단)</h2>
            <p>운영자는 사이트의 유지보수, 서버 점검 등의 사유로 서비스의 일부 또는 전부를 일시적으로 중단할 수 있습니다.</p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>제 4 조 (저작권)</h2>
            <p>본 사이트에서 제공하는 디자인 및 독자적인 콘텐츠의 저작권은 운영자에게 있으며, 무단 복제 및 상업적 이용을 금합니다.</p>
          </section>

          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "40px" }}>시행일: 2026년 4월 28일</p>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: "14px" }}>
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
