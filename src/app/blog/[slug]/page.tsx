import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import localData from "../../../../public/data/local-info.json";
import { getItemIdBySlug } from "@/lib/item-slug-map";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    return { title: "포스트를 찾을 수 없습니다." };
  }

  return {
    title: postData.title,
    description: postData.summary,
    openGraph: {
      title: postData.title,
      description: postData.summary,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    return notFound();
  }

  // 연관 게시글 찾기 (같은 카테고리에서 현재 글 제외하고 3개)
  const allPosts = getSortedPostsData();
  const relatedPosts = allPosts
    .filter(p => p.category === postData.category && p.slug !== postData.slug)
    .slice(0, 3);

  const allItems = [
    ...(localData.educationNews || []),
    ...(localData.events || []), 
    ...(localData.benefits || []), 
    ...(localData.restaurants || []),
    ...(localData.education || []),
    ...(localData.jobs || []),
    ...(localData.culture || []),
    ...(localData.realEstate || []),
    ...(localData.hotTopics || [])
  ];
  
  const cleanSlug = slug.replace(/\/$/, "");
  
  // 1. 본문 내의 <!-- [ITEM_ID: ...] --> 태그에서 ID 추출 (최우선)
  const itemIdMatch = postData.content.match(/<!--\s*\[ITEM_ID:\s*(.*?)\s*\]\s*-->/);
  const extractedItemId = itemIdMatch ? itemIdMatch[1].trim() : null;

  // 2. 슬러그 맵핑에서 ID 찾기 (ITEM_ID가 없을 때만 사용)
  const slugMappedId = getItemIdBySlug(cleanSlug);

  // 최종 ID: ITEM_ID 태그 > slug 맵 순서, 없으면 null (fuzzy 매칭 완전 제거)
  const finalItemId = extractedItemId || slugMappedId || null;

  // ID가 명확하게 있을 때만 매칭 (키워드/제목 기반 fuzzy 매칭 완전 제거)
  const matchedItem = finalItemId
    ? allItems.find(item => item.id.toLowerCase() === finalItemId.toLowerCase())
    : null;

  // 청년 관련 링크 (매칭된 아이템이 없을 때 기본 링크로 사용)
  const youthKeywords = ["youth", "청년", "lab", "이사비", "주거", "전월세", "보증금", "월세", "꿈드림"];
  const isPlatformCity = slug.toLowerCase().includes("platform") || postData.title.includes("플랫폼시티") || slug.toLowerCase().includes("guseong") || postData.title.includes("구성역");
  const isYouthRelated = !isPlatformCity && youthKeywords.some(k => 
    slug.toLowerCase().includes(k) || 
    postData.title.toLowerCase().includes(k)
  );

  // 기본 링크 결정: 매칭된 아이템이 있으면 해당 링크, 없으면 청년/시청 홈페이지
  let sourceLink = matchedItem?.link || (isYouthRelated ? "https://youth.yongin.go.kr" : "https://www.yongin.go.kr");
  
  // 특정 글인 경우 네이버 검색 결과로 연결
  if (slug.includes("kids-cafe")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EB%B3%B4%EC%A0%95%EB%8F%99+%EC%B9%B4%ED%8E%98%EA%B1%B0%EB%A6%AC+%EC%98%88%EC%8A%A4%ED%82%A4%EC%A6%88%EC%A1%B4+%EC%B9%B4%ED%8E%98";
  } else if (slug.includes("walking-trail")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EC%84%B1%EB%B3%B5%EB%8F%99+%EC%82%B0%EC%B1%85%EB%A1%9C";
  } else if (slug.includes("lake-sunset")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EA%B8%B0%ED%9D%A5%ED%98%B8%EC%88%98%EA%B3%B5%EC%9B%90+%EB%91%98%EB%A0%88%EA%B8%B8";
  } else if (slug.includes("suji-sinbong-food")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EC%8B%A0%EB%B4%89%EB%8F%99+%EC%99%B8%EC%8B%9D%ED%83%80%EC%9A%B4+%EB%A7%9B%EC%A7%91";
  } else if (slug.includes("forest-healing")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EC%9A%A9%EC%9D%B8+%EC%9E%90%EC%97%B0%ED%9C%B4%EC%96%91%EB%A6%BC";
  } else if (slug.includes("rural-theme-park")) {
    sourceLink = "https://search.naver.com/search.naver?query=%EC%9A%A9%EC%9D%B8%EB%86%8D%EC%B4%8C%ED%85%8C%EB%A7%88%ED%8C%8C%ED%81%AC";
  }

  let buttonText = postData.category === "맛집" ? "🔗 원문보기" : "🔗 자세한 내용 원문 확인하기";

  // 청년 관련 특화 버튼 텍스트 (매칭된 아이템이 없을 때만 적용)
  if (isYouthRelated && !matchedItem) {
    if (slug.includes("moving") || slug.includes("housing") || slug.includes("rent") || postData.title.includes("주거") || postData.title.includes("이사")) {
      buttonText = "🏠 용인청년 Lab 주거지원 페이지 가기";
    } else {
      buttonText = "🔗 용인청년 Lab 공식 홈페이지 가기";
    }
  }

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "40px 20px" }}>
      {/* ===== 블로그 본문 ===== */}
      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link href="/blog" style={{
          display: "inline-block", color: "#0ea5e9", fontWeight: 700, fontSize: 14,
          marginBottom: 24, textDecoration: "none"
        }}>
          ← 다른 소식 더 보기
        </Link>

        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", background: "rgba(2,132,199,0.1)", padding: "4px 10px", borderRadius: 12, border: "1px solid rgba(2,132,199,0.2)" }}>
              {postData.category}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, color: "white", marginBottom: 16, lineHeight: 1.3 }}>
            {postData.title}
          </h1>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>작성일: {postData.date}</p>
          </div>
        </header>

        {/* 핵심 요약 박스 (SEO 및 가독성) */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(237,100,166,0.1) 100%)", 
          padding: "24px", 
          borderRadius: "20px", 
          marginBottom: "40px",
          border: "1px solid rgba(249,115,22,0.2)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -10, right: -10, fontSize: "60px", opacity: 0.1 }}>💡</div>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "800", color: "#fb923c" }}>📝 한눈에 보는 핵심 요약</h3>
          <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6, fontSize: "15px" }}>
            {postData.summary}
          </p>
        </div>

        {/* 대표 이미지 */}
        {postData.imageUrl && (
          <div style={{ 
            width: "100%", 
            height: "auto", 
            maxHeight: "450px",
            borderRadius: "24px", 
            overflow: "hidden", 
            marginBottom: "40px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <img 
              src={postData.imageUrl} 
              alt={postData.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* 마크다운 렌더링 구역 */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          backdropFilter: "blur(10px)",
          padding: "40px", 
          borderRadius: "24px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#cbd5e1",
          lineHeight: "1.8",
          fontSize: "17px"
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h3: ({ node, ...props }) => (
                <h3 {...props} style={{ color: "white", marginTop: "2.5rem", marginBottom: "1.2rem", fontSize: "22px", fontWeight: "800", borderLeft: "4px solid #f97316", paddingLeft: "15px" }} />
              ),
              p: ({ node, ...props }) => (
                <p {...props} style={{ marginBottom: "1.5rem" }} />
              ),
              li: ({ node, ...props }) => (
                <li {...props} style={{ marginBottom: "8px" }} />
              ),
              img: ({ node, ...props }) => (
                <div style={{ margin: "2.5rem 0", textAlign: "center" }}>
                  <img 
                    {...props} 
                    style={{ 
                      maxWidth: "100%", 
                      borderRadius: "16px", 
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      display: "inline-block",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }} 
                  />
                </div>
              )
            }}
          >
            {postData.content.replace(/<!--\s*\[ITEM_ID:.*?\]\s*-->/g, "")}
          </ReactMarkdown>

          <div style={{ marginTop: "40px", padding: "24px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "10px", marginTop: 0 }}>🔗 정보 원문 및 출처</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              상세한 내용은 공식 홈페이지를 통해 다시 한번 확인하시기 바랍니다.<br />
              <a href={sourceLink} target="_blank" rel="noopener noreferrer" style={{ 
                display: "inline-block", marginTop: "10px", color: "white", background: "#0ea5e9", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 700 
              }}>
                {buttonText}
              </a>
            </p>
          </div>
        </div>

        {/* 연관 게시글 추천 (AdSense 승인 핵심 요소) */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: "60px" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "900", color: "white", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>👀</span> 이 소식은 어떠세요?
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    padding: "20px", 
                    borderRadius: "20px", 
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    height: "100%",
                    transition: "transform 0.2s, background 0.2s"
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {post.category}
                    </span>
                    <h4 style={{ margin: "8px 0", fontSize: "16px", fontWeight: "700", color: "white", lineHeight: 1.4 }}>
                      {post.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {post.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 하단 태그 */}
        <div style={{ marginTop: 60, display: "flex", gap: 10, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px" }}>
          {postData.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 13, color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "6px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* SEO를 위한 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": postData.title,
            "datePublished": postData.date,
            "description": postData.summary,
            "image": postData.imageUrl || "https://yongin-love-info.com/og-image.png",
            "author": { "@type": "Organization", "name": "용인시 생활 정보" }
          })
        }}
      />
    </div>
  );
}
