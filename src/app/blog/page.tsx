import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/posts";
import BlogListClient from "./BlogListClient";

export default function BlogPage() {
  const posts = getSortedPostsData().map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category || "정보",
    summary: post.summary || post.content.substring(0, 100) + "...",
    tags: post.tags || []
  }));

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

        <Suspense fallback={<div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}><div style={{ marginBottom: "10px", fontSize: "30px" }}>🔄</div>최신 소식을 불러오고 있습니다...</div>}>
          <BlogListClient initialPosts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
