import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "#1e293b",
      color: "#94a3b8",
      padding: "60px 20px 40px",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      fontSize: "14px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "40px",
          marginBottom: "50px",
          textAlign: "left"
        }}>
          {/* 브랜드 섹션 */}
          <div>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 800, marginBottom: "15px" }}>🏘️ 용인시 생활 정보</h3>
            <p style={{ lineHeight: "1.6", color: "#64748b" }}>
              용인 시민들의 더 나은 일상을 위해<br />
              꼭 필요한 지역 정보와 혜택을<br />
              가장 빠르고 정확하게 전달합니다.
            </p>
          </div>

          {/* 사이트 맵 */}
          <div>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "15px" }}>주요 메뉴</h4>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
              <li><Link href="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>사이트 소개</Link></li>
              <li><Link href="/blog" style={{ color: "#94a3b8", textDecoration: "none" }}>전체 블로그</Link></li>
              <li><Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>문의하기</Link></li>
            </ul>
          </div>

          {/* 고객 지원 및 약관 */}
          <div>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "15px" }}>정책 및 안내</h4>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
              <li><Link href="/privacy" style={{ color: "#cbd5e1", fontWeight: 600, textDecoration: "none" }}>개인정보처리방침</Link></li>
              <li><Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</Link></li>
              <li><Link href="/sitemap" style={{ color: "#94a3b8", textDecoration: "none" }}>사이트맵</Link></li>
            </ul>
          </div>

          {/* 컨택트 */}
          <div>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "15px" }}>Contact</h4>
            <p style={{ color: "#64748b", marginBottom: "10px" }}>bopdoryainolza2026@gmail.com</p>
            <p style={{ fontSize: "12px", color: "#475569" }}>평일 10:00 - 17:00 운영</p>
          </div>
        </div>

        <div style={{ 
          borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
          paddingTop: "30px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: "10px"
        }}>
          <p>© 2026 용인시 생활 정보 포털. All rights reserved.</p>
          <p style={{ fontSize: "12px", color: "#475569", maxWidth: "600px", textAlign: "center" }}>
            본 서비스는 공공데이터를 기반으로 한 정보 큐레이션 서비스이며, 실제 상세 내용은 반드시 해당 주관 기관을 통해 다시 한번 확인하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
