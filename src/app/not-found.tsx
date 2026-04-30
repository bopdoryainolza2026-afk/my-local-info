import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ 
      fontFamily: "'Noto Sans KR', sans-serif", 
      background: "#f0f9ff", 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      textAlign: "center"
    }}>
      <div style={{
        background: "white",
        padding: "60px 40px",
        borderRadius: "32px",
        boxShadow: "0 20px 50px rgba(14, 165, 233, 0.1)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🚧</div>
        <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#1e293b", marginBottom: "16px" }}>
          페이지를 찾을 수 없어요
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.6, marginBottom: "32px" }}>
          요청하신 주소가 정확한지 확인해 주세요.<br />
          이미 사라졌거나 다른 주소로 옮겨졌을 수 있습니다.
        </p>
        <Link href="/" style={{
          display: "inline-block",
          background: "#0ea5e9",
          color: "white",
          padding: "16px 32px",
          borderRadius: "16px",
          fontWeight: 700,
          fontSize: "16px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
          transition: "transform 0.2s"
        }}>
          🏠 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
