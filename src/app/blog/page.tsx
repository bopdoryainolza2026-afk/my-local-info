import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif", background: "#f0f9ff", minHeight: "100vh" }}>
      {/* ===== 헤더 ===== */}
      <header style={{
        background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #7dd3fc 100%)",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 16px rgba(2,132,199,0.3)",
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
              border: "1.5px solid rgba(255,255,255,0.6)",
              textDecoration: "none"
            }}>
              🏢 소개
            </Link>
            <Link href="/blog" style={{
              fontSize: 13, fontWeight: 600, color: "white",
              padding: "6px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
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
          📝 생활 정보 블로그
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 40 }}>
          AI가 정리해드리는 용인시의 유용한 생활 팁과 소식입니다.
        </p>

        {/* 블로그 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {allPostsData.length > 0 ? (
            allPostsData.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", background: "#e0f2fe", padding: "4px 10px", borderRadius: 12 }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{post.date}</span>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 10 }}>{post.title}</h2>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                  {post.summary}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>📭</p>
              <p style={{ fontSize: 16 }}>아직 올라온 글이 없습니다.</p>
            </div>
          )}
        </div>
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
