import Link from "next/link";

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "40px 20px" }}>
      <main style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 10 }}>이용약관</h1>
        <p style={{ color: "#94a3b8", marginBottom: 40 }}>시행일: 2026년 5월 4일</p>
        
        <div style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)", lineHeight: "1.8", color: "#cbd5e1" }}>
          
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" }}>제 1 조 (목적)</h2>
            <p>본 약관은 '용인시 생활 정보'(이하 '본 사이트')가 제공하는 지역 정보 및 관련 제반 서비스의 이용 조건 및 절차, 이용자와 운영자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" }}>제 2 조 (정보의 제공 및 신뢰성)</h2>
            <p>1. 본 사이트는 공공데이터포털(data.go.kr) 등 공식적인 기관의 데이터를 바탕으로 정보를 제공하며, 인공지능(AI) 기술을 활용하여 사용자 편의에 맞게 정보를 재구성합니다. <br />
            2. 본 사이트에서 제공하는 정보는 참고용이며, 정보의 완전성이나 최신성을 100% 보장하지 않습니다. 실질적인 행정 절차나 지원금 신청 등 중요한 사항은 반드시 주관 기관의 공식 공고문을 확인하시기 바랍니다.</p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" }}>제 3 조 (서비스의 이용 및 중단)</h2>
            <p>운영자는 시스템 점검, 서버 교체 또는 통신 장애 등의 사유가 발생할 경우 서비스 제공을 일시적으로 중단할 수 있으며, 이로 인해 발생하는 문제에 대해서는 책임을 지지 않습니다.</p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" }}>제 4 조 (지적재산권)</h2>
            <p>본 사이트의 디자인, 로고, 그리고 독자적으로 작성된 큐레이션 콘텐츠의 저작권은 운영자에게 있습니다. 운영자의 승인 없이 무단으로 복제, 배포, 또는 상업적으로 이용하는 행위는 엄격히 금지됩니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" }}>제 5 조 (면책조항)</h2>
            <p>운영자는 사용자가 본 사이트의 정보를 신뢰하여 행한 결정이나 행동으로 인해 발생한 직간접적인 손해에 대하여 어떠한 법적 책임도 지지 않습니다. 모든 최종 결정과 책임은 사용자 본인에게 있습니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
