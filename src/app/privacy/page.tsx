import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "40px 20px" }}>
      <main style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 10 }}>개인정보 처리방침</h1>
        <p style={{ color: "#94a3b8", marginBottom: 40 }}>최종 수정일: 2026년 5월 4일</p>
        
        <div style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)", lineHeight: "1.8", color: "#cbd5e1" }}>
          
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #f97316", paddingLeft: "15px" }}>1. 개인정보의 수집 및 이용 목적</h2>
            <p>'용인시 생활 정보'(이하 '본 사이트')는 별도의 회원가입 없이 모든 콘텐츠를 열람할 수 있는 공개 정보 플랫폼입니다. 본 사이트는 원칙적으로 사용자의 이름, 이메일 주소, 전화번호 등 개인을 식별할 수 있는 정보를 직접 수집하지 않습니다.</p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #f97316", paddingLeft: "15px" }}>2. 구글 애드센스 및 쿠키(Cookie) 정책</h2>
            <p>본 사이트는 구글(Google Inc.)에서 제공하는 웹 광고 서비스인 '구글 애드센스'를 이용하고 있습니다. 구글 및 제3자 제공업체는 사용자가 본 사이트 또는 다른 웹사이트를 방문한 기록을 바탕으로 최적화된 광고를 게재하기 위해 쿠키를 사용합니다.</p>
            <ul style={{ paddingLeft: "20px", marginTop: "15px", color: "#94a3b8" }}>
              <li style={{ marginBottom: "10px" }}><strong>광고 쿠키:</strong> 구글은 광고 쿠키를 사용하여 사용자의 방문 정보를 기반으로 맞춤형 광고를 제공합니다.</li>
              <li style={{ marginBottom: "10px" }}><strong>DART 쿠키:</strong> 구글은 DART 쿠키를 사용하여 본 사이트 및 인터넷상의 다른 사이트 방문 정보를 토대로 광고를 게재할 수 있습니다.</li>
              <li><strong>쿠키 거부 방법:</strong> 사용자는 구글의 [광고 설정] 페이지 또는 [aboutads.info]를 방문하여 맞춤 설정 광고를 해제할 수 있습니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #f97316", paddingLeft: "15px" }}>3. 로그 데이터 및 분석</h2>
            <p>본 사이트는 서비스 개선 및 방문 통계 분석을 위해 구글 애널리틱스(Google Analytics) 등을 활용할 수 있습니다. 이 과정에서 브라우저 유형, 접속 시간, 방문 페이지 등의 비식별 정보가 자동으로 생성 및 수집될 수 있으며, 이는 오직 사이트 운영 품질 향상을 위해서만 사용됩니다.</p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #f97316", paddingLeft: "15px" }}>4. 제3자 웹사이트 링크</h2>
            <p>본 사이트는 공공기관이나 외부 뉴스 소스의 링크를 포함할 수 있습니다. 해당 외부 사이트의 개인정보 보호 정책은 본 사이트와 무관하므로, 링크를 통해 이동한 웹사이트의 정책을 별도로 확인하시기 바랍니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #f97316", paddingLeft: "15px" }}>5. 문의 사항</h2>
            <p>본 개인정보 처리방침에 관하여 궁금한 점이 있으시면 운영자 이메일(bopdoryainolza2026@gmail.com)로 문의해 주시기 바랍니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
