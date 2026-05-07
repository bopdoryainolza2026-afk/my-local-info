"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";

// 블로그 포스트 타입 정의
interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
}

function BlogList() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/data/search-index.json");
        const data = await response.json();
        const blogPosts = data
          .filter((item: any) => item.type === "post")
          .map((item: any) => ({
            slug: item.url.replace("/blog/", ""),
            title: item.title,
            date: item.date || "2026-05-01",
            category: item.category || "정보",
            summary: item.summary || item.content.substring(0, 100) + "...",
            tags: item.tags || []
          }));
        setPosts(blogPosts);
      } catch (err) {
        console.error("블로그 데이터를 불러오는데 실패했습니다:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = query
    ? posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.summary.toLowerCase().includes(query.toLowerCase())
    )
    : posts;

  return (
    <>
      {/* 검색창 */}
      <div style={{ marginBottom: 40 }}>
        <SearchBar placeholder="찾으시는 지역 정보가 있으신가요?" initialValue={query} />
      </div>

      {query && (
        <p style={{ marginBottom: 24, fontSize: 16, color: "#fb923c", fontWeight: 700 }}>
          🔍 '{query}' 검색 결과 ({filteredPosts.length}건)
        </p>
      )}

      {/* 블로그 목록 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
            <div style={{ marginBottom: "10px", fontSize: "30px" }}>🔄</div>
            최신 소식을 불러오고 있습니다...
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: 24,
                padding: "32px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textDecoration: "none",
                display: "block",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0ea5e9",
                  background: "rgba(14,165,233,0.1)",
                  padding: "6px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(14,165,233,0.2)"
                }}>
                  {post.category}
                </span>
                <span style={{ fontSize: 13, color: "#64748b" }}>{post.date}</span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "white", marginBottom: "12px", lineHeight: 1.4 }}>{post.title}</h2>
              <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "20px" }}>
                {post.summary}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#f97316", fontWeight: "700", fontSize: "14px" }}>
                더 읽어보기 <span style={{ fontSize: "18px" }}>→</span>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8", background: "rgba(255,255,255,0.02)", borderRadius: "30px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: 60, marginBottom: 20 }}>🔍</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "white" }}>아쉽게도 결과가 없네요.</p>
            <p style={{ fontSize: 15, marginTop: 10 }}>다른 검색어로 다시 찾아보시겠어요?</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function BlogPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "40px 20px" }}>
      {/* ===== 메인 섹션 ===== */}
      <main style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: "50px" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, color: "white", marginBottom: 16 }}>
            📝 생활 정보 블로그
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6 }}>
            용인시 주민들을 위한 실질적인 도움과<br />
            가장 핫한 지역 소식을 전달해 드립니다.
          </p>
        </div>

        <Suspense fallback={<div style={{ color: "white" }}>로딩 중...</div>}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}
