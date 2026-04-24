import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import localData from "../../../../public/data/local-info.json";

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

  const allItems = [...localData.events, ...localData.benefits];
  const matchedItem = allItems.find(item => 
    postData.content.includes(`[ITEM_ID: ${item.id}]`) ||
    postData.title.includes(item.name) || 
    postData.content.includes(item.name)
  );
  const sourceLink = matchedItem?.link || "https://data.go.kr/";

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
              border: "1.5px solid rgba(255,255,255,0.6)",
              textDecoration: "none"
            }}>
              📝 블로그
            </Link>
          </div>
        </div>
      </header>

      {/* ===== 블로그 본문 ===== */}
      <article style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>
        <Link href="/blog" style={{
          display: "inline-block", color: "#0284c7", fontWeight: 700, fontSize: 14,
          marginBottom: 24, textDecoration: "none"
        }}>
          ← 목록으로 돌아가기
        </Link>
        
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", background: "#e0f2fe", padding: "4px 10px", borderRadius: 12 }}>
              {postData.category}
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e293b", marginBottom: 12, lineHeight: 1.3 }}>
            {postData.title}
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>최종 업데이트: {postData.date}</p>
            {/* 날짜 비교 및 경고 문구 추가 */}
            {(() => {
              const postDate = new Date(postData.date);
              const today = new Date();
              const diffTime = Math.abs(today.getTime() - postDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays > 90) {
                return (
                  <div style={{ 
                    background: "#fff7ed", color: "#c2410c", 
                    padding: "6px 12px", borderRadius: "8px", 
                    fontSize: "12px", fontWeight: 700,
                    border: "1px solid #ffedd5",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    ⚠️ 작성된 지 3개월이 넘은 정보입니다.
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </header>

        {/* 오래된 글 안내 상세 배너 */}
        {(() => {
          const postDate = new Date(postData.date);
          const today = new Date();
          const diffDays = Math.ceil(Math.abs(today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 90) {
            return (
              <div style={{ 
                background: "#fff1f2", border: "1px solid #fecdd3", 
                padding: "16px", borderRadius: "16px", marginBottom: "32px",
                display: "flex", gap: "12px", alignItems: "flex-start"
              }}>
                <span style={{ fontSize: "24px" }}>📢</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: "#be123c", fontSize: "15px" }}>잠시만요! 이 정보는 업데이트가 필요할 수 있어요.</p>
                  <p style={{ margin: "4px 0 0", color: "#e11d48", fontSize: "13px", lineHeight: 1.5 }}>
                    게시글이 작성된 지 <b>{diffDays}일</b>이 지났습니다. 지원 사업이나 행사의 경우 상세 내용이 변경되었을 수 있으니, 꼭 하단의 <b>'원문 출처'</b>를 통해 최신 내용을 확인해 주세요!
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* 마크다운 렌더링 구역 */}
        <div className="prose prose-sky max-w-none" style={{ background: "white", padding: "32px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {postData.content}
          </ReactMarkdown>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://yongin-love-info.com" },
                  { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://yongin-love-info.com/blog" },
                  { "@type": "ListItem", "position": 3, "name": postData.title, "item": `https://yongin-love-info.com/blog/${slug}` }
                ]
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": postData.title,
                "datePublished": postData.date,
                "description": postData.summary,
                "author": { "@type": "Organization", "name": "용인시 생활 정보" },
                "publisher": { "@type": "Organization", "name": "용인시 생활 정보" }
              })
            }}
          />

          <hr style={{ margin: "40px 0 20px", borderColor: "#e2e8f0" }} />
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#334155", marginBottom: "8px", marginTop: 0 }}>ℹ️ 정보 안내</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              이 글은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", textDecoration: "none" }}>data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
            </p>
            <div style={{ marginTop: "12px" }}>
              <a href={sourceLink} target="_blank" rel="noopener noreferrer" style={{ 
                display: "inline-block", fontSize: "13px", fontWeight: "bold", 
                color: "white", background: "#0ea5e9", padding: "8px 16px", 
                borderRadius: "20px", textDecoration: "none" 
              }}>
                🔗 원문 출처 바로가기
              </a>
            </div>
          </div>
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
        <p>© 2026 용인시 생활 정보</p>
      </footer>
    </div>
  );
}
