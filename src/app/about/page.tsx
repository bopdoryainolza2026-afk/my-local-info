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
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "#1e293b" }}>🤖 콘텐츠 생성 방식 (AI 활용)</h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            수집된 공공데이터들은 인공지능(AI)을 통해 주민분들이 이해하기 쉽도록 친근한 문구로 자동 요약 및 정리되어 블로그 형태로 작성됩니다. 정보의 정확성을 위해 원본 출처 확인을 항상 권장합니다.
          </p>
        </section>
      </main>

      {/* ===== 푸터 ===== */}
      <footer style={{
        background: "#1e293b",
        color: "#94a3b8",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 13,
      }}>
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
