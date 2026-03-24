import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostData, getSortedPostsData } from "@/lib/posts";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    return notFound();
  }

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
              🏘️ 성남시 생활 정보
            </span>
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
      </header>

      {/* ===== 블로그 본문 ===== */}
      <article style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>
        <Link href="/blog" style={{
          display: "inline-block", color: "#f97316", fontWeight: 700, fontSize: 14,
          marginBottom: 24, textDecoration: "none"
        }}>
          ← 목록으로 돌아가기
        </Link>
        
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316", background: "#fff7ed", padding: "4px 10px", borderRadius: 12 }}>
              {postData.category}
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e293b", marginBottom: 12, lineHeight: 1.3 }}>
            {postData.title}
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>{postData.date}</p>
        </header>

        {/* 마크다운 렌더링 구역 */}
        <div className="prose prose-orange max-w-none" style={{ background: "white", padding: "32px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {postData.content}
          </ReactMarkdown>
        </div>

        {/* 하단 태그 */}
        <div style={{ marginTop: 40, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {postData.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 13, color: "#64748b", background: "#f1f5f9", padding: "4px 12px", borderRadius: 6 }}>
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* ===== 푸터 ===== */}
      <footer style={{
        background: "#1e293b",
        color: "#94a3b8",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 13,
      }}>
        <p>© 2026 성남시 생활 정보</p>
      </footer>
    </div>
  );
}
