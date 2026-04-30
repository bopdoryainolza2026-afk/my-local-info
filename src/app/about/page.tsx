import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif", background: "#fffbf5", minHeight: "100vh" }}>
      {/* ===== 헤더 ===== */}
      <header style={{
        background: "linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 16px rgba(249,115,22,0.3)",
      }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
              🏘️ 용인시 생활 정보
            </span>
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/about" style={{
              fontSize: 13, fontWeight: 600, color: "white",
              padding: "6px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.6)",
              textDecoration: "none"
            }}>
              🏢 소개
            </Link>
            <Link href="/blog" style={{
              fontSize: 13, fontWeight: 600, color: "white",
              padding: "6px 14px", borderRadius: 20,
              border: "1.5px solid rgba(255,255,255,0.6)",
              textDecoration: "none"
            }}>
              📝 블로그
            </Link>
          </div>
        </div>
      </header>

      {/* ===== 메인 섹션 ===== */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 60px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", marginBottom: 12 }}>
          🏢 사이트 소개
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 40, lineHeight: 1.6 }}>
          '용인시 생활 정보'는 지역 주민들을 위해 꼭 필요한 최신 정보를 제공하는 서비스입니다.
        </p>

        <section style={{ marginBottom: 30, background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "#1e293b" }}>🎯 운영 목적</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            지역 주민들이 놓치기 쉬운 유용한 생활 정보(축제, 행사, 지원금 등)를 누구나 한곳에서 쉽고 빠르게 찾아볼 수 있도록 돕기 위해 운영됩니다.
          </p>
        </section>

        <section style={{ marginBottom: 30, background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "#1e293b" }}>📊 데이터 출처</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            본 사이트에서 제공되는 모든 기본 정보는 <strong>공공데이터포털(data.go.kr)</strong> 등 공식적이고 신뢰할 수 있는 기관의 공개 데이터를 바탕으로 수집됩니다.
          </p>
        </section>

        <section style={{ marginBottom: 30, background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "#1e293b" }}>💎 콘텐츠 큐레이션 (AI 기술 활용)</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            수집된 다양한 지역 정보들은 인공지능(AI) 기술을 활용하여 주민분들이 읽기 편하도록 핵심 내용을 요약하고 정리합니다. 저희 '용인시 생활 정보'는 단순한 자동 생성을 넘어, 주민들에게 실질적인 가치를 효율적으로 전달하기 위해 노력하고 있습니다.
          </p>
        </section>

        <section style={{ marginBottom: 30, background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", padding: 32, borderRadius: 20, color: "white" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "white" }}>🌟 우리의 약속</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8, fontSize: "15px" }}>
            <li><b>정확성 최우선:</b> 공공기관의 데이터를 바탕으로 검증된 정보만을 전달합니다.</li>
            <li><b>편의성 제공:</b> 복잡한 정보를 누구나 이해하기 쉬운 언어로 풀어냅니다.</li>
            <li><b>신속한 업데이트:</b> 지역 사회의 변화를 빠르게 감지하여 매일 새로운 소식을 전합니다.</li>
            <li><b>주민 중심 서비스:</b> 광고보다는 정보의 가치를 먼저 생각하며 운영합니다.</li>
          </ul>
        </section>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            '용인시 생활 정보'는 용인 시민 여러분의 더 나은 일상을 응원합니다.
          </p>
        </div>
      </main>

      {/* ===== 푸터 ===== */}
      <footer style={{
        background: "#1e293b",
        color: "#94a3b8",
        padding: "32px 20px",
        textAlign: "center",
        fontSize: 13,
      }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", gap: 20 }}>
          <Link href="/privacy" style={{ color: "#cbd5e1", textDecoration: "none" }}>개인정보 처리방침</Link>
          <Link href="/about" style={{ color: "#cbd5e1", textDecoration: "none" }}>사이트 소개</Link>
        </div>
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
