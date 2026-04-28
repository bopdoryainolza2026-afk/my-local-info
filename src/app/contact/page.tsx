import Link from "next/link";

export default function ContactPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 30 }}>문의하기</h1>
        
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", lineHeight: "1.7", color: "#334155" }}>
          <p style={{ marginBottom: "20px" }}>
            용인시 생활 정보 사이트를 이용해 주셔서 감사합니다. <br />
            사이트 내용에 대한 수정 요청, 제휴 문의, 또는 불편 사항이 있으시면 아래 연락처로 언제든지 문의해 주세요.
          </p>

          <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>운영자 연락처</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px" }}>📧 <strong>이메일:</strong> <a href="mailto:support@yongin-info.com" style={{ color: "#f97316", textDecoration: "none" }}>support@yongin-info.com</a></li>
              <li>⏰ <strong>답변 시간:</strong> 평일 09:00 ~ 18:00 (순차적으로 답변해 드립니다)</li>
            </ul>
          </div>

          <p style={{ fontSize: "15px" }}>
            여러분의 소중한 의견은 더 나은 서비스를 만드는 데 큰 힘이 됩니다. <br />
            항상 용인 시민분들께 유용한 정보를 전해드리기 위해 노력하겠습니다.
          </p>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: "14px" }}>
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
