"use client";

import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function SitemapPage() {
  const allPosts = getSortedPostsData();
  const categories = Array.from(new Set(allPosts.map(post => post.category)));

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "60px 20px", color: "#cbd5e1" }}>
      <main style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* 헤더 섹션 */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{ fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, color: "white", marginBottom: "20px" }}>
            📍 사이트맵
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8" }}>
            용인시 생활 정보 포털의 모든 메뉴를 한눈에 확인하세요.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "40px" 
        }}>
          
          {/* 섹션 1: 주요 서비스 */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            padding: "40px", 
            borderRadius: "32px", 
            border: "1px solid rgba(255, 255, 255, 0.1)" 
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              🚀 주요 서비스
            </h2>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><SitemapLink href="/" label="홈페이지 메인" /></li>
              <li><SitemapLink href="/blog" label="생활 정보 블로그" /></li>
              <li><SitemapLink href="/about" label="사이트 소개" /></li>
              <li><SitemapLink href="/contact" label="문의하기" /></li>
            </ul>
          </div>

          {/* 섹션 2: 블로그 카테고리 */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            padding: "40px", 
            borderRadius: "32px", 
            border: "1px solid rgba(255, 255, 255, 0.1)" 
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              📝 블로그 카테고리
            </h2>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {categories.map(category => (
                <li key={category}>
                  <SitemapLink href={`/blog?q=${category}`} label={`${category} 소식`} />
                </li>
              ))}
            </ul>
          </div>

          {/* 섹션 3: 정보 및 약관 */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            padding: "40px", 
            borderRadius: "32px", 
            border: "1px solid rgba(255, 255, 255, 0.1)" 
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              ⚖️ 정책 및 안내
            </h2>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><SitemapLink href="/privacy" label="개인정보처리방침" /></li>
              <li><SitemapLink href="/terms" label="이용약관" /></li>
              <li><SitemapLink href="/sitemap.xml" label="검색엔진용 사이트맵 (XML)" /></li>
            </ul>
          </div>

        </div>

        {/* 하단 장식 */}
        <div style={{ marginTop: "80px", textAlign: "center", paddingTop: "40px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <Link href="/" style={{ 
            color: "#0ea5e9", 
            fontWeight: 800, 
            textDecoration: "none",
            fontSize: "15px",
            background: "rgba(14, 165, 233, 0.1)",
            padding: "12px 30px",
            borderRadius: "20px"
          }}>
            ← 메인 화면으로 돌아가기
          </Link>
        </div>

      </main>
    </div>
  );
}

function SitemapLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ 
      color: "#94a3b8", 
      textDecoration: "none", 
      fontSize: "16px", 
      fontWeight: 500,
      transition: "color 0.2s",
      display: "block"
    }}
    onMouseEnter={(e: any) => e.target.style.color = "white"}
    onMouseLeave={(e: any) => e.target.style.color = "#94a3b8"}
    >
      • {label}
    </Link>
  );
}
