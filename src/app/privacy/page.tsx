import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 30 }}>개인정보 처리방침</h1>
        
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", lineHeight: "1.7", color: "#334155" }}>
          
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>1. 개인정보 수집 및 이용 목적</h2>
            <p>'용인시 생활 정보'는 별도의 사용자 회원가입 절차 없이 모든 서비스를 이용할 수 있으며, 이 과정에서 이름, 연락처 등의 개인정보를 수집하지 않습니다.</p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>2. 구글 애드센스 및 쿠키 이용 안내</h2>
            <p>본 사이트는 구글(Google)에서 제공하는 광고 서비스(애드센스)를 이용하고 있습니다.</p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li>구글은 쿠키(Cookie)를 사용하여 사용자의 웹사이트 방문 기록을 바탕으로 광고를 제공합니다.</li>
              <li>사용자는 구글의 [광고 설정] 페이지를 통해 맞춤 설정 광고를 해제할 수 있습니다.</li>
              <li>본 사이트는 방문자의 접속 빈도나 방문 시간 등을 분석하기 위해 구글 애널리틱스를 활용할 수 있으며, 이 데이터는 사이트 개선 목적으로만 사용됩니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>3. 타사 쿠키 및 광고 네트워크</h2>
            <p>사이트에 게재되는 광고는 서드파티 제공업체나 광고 네트워크에서 제공할 수 있습니다. 이 과정에서 해당 업체들이 쿠키를 사용할 수 있으며, 사용자는 브라우저 설정에서 쿠키 수집을 거부할 수 있습니다.</p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>4. 데이터 보안 및 출처</h2>
            <p>본 사이트는 공공데이터포털의 데이터를 활용하며, 사용자에게 유용한 정보를 전달하는 큐레이션 서비스입니다. 제3자에게 개인정보를 제공하거나 매매하지 않습니다.</p>
          </section>

          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "40px" }}>최종 수정일: 2026년 4월 19일</p>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: "14px" }}>
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
