"use client";

// Build Refresh: 2026-05-06
import Link from "next/link";
import localData from "../../public/data/local-info.json";
import { getSortedPostsData } from "@/lib/posts";
import RightSidebar from "@/components/RightSidebar";
import { PagedEventSection, PagedBenefitSection, PagedRestaurantSection, PagedEducationSection, PagedJobSection, PagedCultureSection } from "@/components/PagedSections";
import SearchBar from "@/components/SearchBar";
import AIRequestForm from "@/components/AIRequestForm";

export default function Home() {
  const { events, benefits, restaurants, education, jobs, culture } = localData;

  const todayStr = new Date().toISOString().split('T')[0];

  const isYongin = (item: any) => 
    (item.name && item.name.includes("용인")) || 
    (item.target && item.target.includes("용인")) || 
    (item.location && item.location.includes("용인"));

  const getActiveItems = (items: any[]) => {
    return items
      .filter(item => {
        const endDate = item.endDate || item.deadline || "9999-12-31";
        return endDate >= todayStr;
      })
      .sort((a, b) => {
        const aStart = a.startDate || a.date || "0000-00-00";
        const bStart = b.startDate || b.date || "0000-00-00";
        return aStart.localeCompare(bStart);
      });
  };

  const yonginEvents = getActiveItems(events.filter(isYongin));
  const yonginBenefits = getActiveItems(benefits.filter(isYongin));
  const yonginEdu = getActiveItems((education || []).filter(isYongin));
  const yonginJobs = getActiveItems((jobs || []).filter(isYongin));
  const yonginCulture = getActiveItems((culture || []).filter(isYongin));

  const allPosts = getSortedPostsData();

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", padding: "0 20px 60px" }}>
      
      {/* ===== 히어로 섹션 (프리미엄 디자인) ===== */}
      <section style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(20px)",
        margin: "40px auto",
        maxWidth: "1000px",
        borderRadius: "40px",
        padding: "80px 40px",
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <h1 style={{ fontSize: "clamp(30px, 7vw, 46px)", fontWeight: 900, color: "white", marginBottom: "20px", lineHeight: 1.2, letterSpacing: "-1px" }}>
          축제부터 지원금까지,<br /> <span style={{ color: "#0ea5e9" }}>용인 생활</span>의 모든 정답을 담다
        </h1>
        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px", lineHeight: 1.6 }}>
          AI가 정리하는 실시간 축제와 정부 지원금,<br />
          우리 동네 꿀팁까지 가장 스마트하게 전달합니다.
        </p>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <SearchBar />
        </div>
      </section>

      {/* ===== 본문 영역 ===== */}
      <main style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        display: "grid",
        gridTemplateColumns: "1fr minmax(300px, 350px)",
        gap: "40px",
        alignItems: "flex-start"
      }}>

        {/* 1. 왼쪽 본문 영역 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          
          {/* ===== 2026 지방선거 특집 섹션 (임시 수록) ===== */}
          <section id="election-special" style={{ 
            scrollMarginTop: 100,
            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 179, 8, 0.05) 100%)",
            borderRadius: "32px",
            padding: "40px",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ background: "#f97316", color: "white", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 900 }}>HOT</span>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: "#fb923c", textTransform: "uppercase", letterSpacing: "1px" }}>2026 지방선거 기획</p>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "white", letterSpacing: "-1px" }}>
                  4년 전 약속, <span style={{ color: "#fb923c" }}>지금은 어디까지 왔을까?</span>
                </h2>
              </div>
              <Link href="/blog" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>전체 보기 →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {allPosts
                .filter(post => post.slug.includes('election') || post.slug.includes('platform-city') || post.slug.includes('semiconductor-highway'))
                .slice(0, 3)
                .map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}`}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "24px",
                      padding: "24px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      height: "100%"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(249, 115, 22, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#fb923c", fontWeight: 800 }}>{post.category}</span>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "white", lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                      {post.summary}
                    </p>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", color: "#fb923c", fontSize: "13px", fontWeight: 700 }}>
                      자세히 보기 <span>→</span>
                    </div>
                  </Link>
                ))
              }
            </div>
          </section>
          <section id="events" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="🎪" title="추천 행사 / 축제" />
            <PagedEventSection items={yonginEvents} allPosts={allPosts} />
          </section>

          <section id="benefits" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="💰" title="지원금 및 맞춤 혜택" />
            <PagedBenefitSection items={yonginBenefits} allPosts={allPosts} />
          </section>

          <section id="education" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="🎓" title="지역 교육 및 강좌" />
            <PagedEducationSection items={yonginEdu} allPosts={allPosts} />
          </section>

          <section id="jobs" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="👔" title="일자리 정보" />
            <PagedJobSection items={yonginJobs} allPosts={allPosts} />
          </section>

          <section id="culture" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="🎨" title="문화 및 전시" />
            <PagedCultureSection items={yonginCulture} allPosts={allPosts} />
          </section>

          <section id="restaurants" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="🍱" title="AI 추천 우리동네 맛집" />
            <PagedRestaurantSection items={restaurants as any[]} allPosts={allPosts} />
          </section>

          <section id="community" style={{ scrollMarginTop: 100 }}>
            <SectionTitle emoji="💬" title="AI 기자 취재 요청" />
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(12px)",
              borderRadius: "32px",
              padding: "48px 32px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "12px" }}>
                  궁금한 소식이 있으신가요? 🕵️‍♂️
                </h3>
                <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
                  우리 동네 맛집, 행사, 정책 등 무엇이든 남겨주세요.<br />
                  AI 블로그 매니저가 내용을 정리하여 기사로 작성해 드립니다.
                </p>
              </div>
              <AIRequestForm />
            </div>
          </section>

          {/* 블로그 링크 카드 */}
          <section style={{ 
            background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
            borderRadius: "32px",
            padding: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            gap: "20px",
            flexWrap: "wrap",
            boxShadow: "0 20px 40px -10px rgba(14, 165, 233, 0.5)"
          }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px" }}>📝 더 많은 소식을 블로그에서 확인하세요</h2>
              <p style={{ fontSize: "16px", opacity: 0.9 }}>AI가 매일 아침 전해드리는 유용한 생활 팁과 정보</p>
            </div>
            <Link href="/blog" style={{
              background: "white",
              color: "#2563eb",
              padding: "14px 28px",
              borderRadius: "16px",
              fontWeight: 800,
              textDecoration: "none",
              fontSize: "15px",
              transition: "transform 0.2s ease"
            }}>
              블로그 바로가기 →
            </Link>
          </section>
        </div>

        {/* 2. 오른쪽 사이드바 영역 */}
        <aside style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "30px" }}>
          <RightSidebar />
          
          <div style={{ 
            padding: "32px", 
            background: "rgba(255, 255, 255, 0.03)", 
            borderRadius: "28px", 
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}>
            <p style={{ fontSize: "13px", fontWeight: 800, color: "#0ea5e9", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>✨ Information</p>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "16px", lineHeight: 1.4 }}>본 사이트는 실시간 공공 데이터를 활용합니다.</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
              매일 새벽 AI 엔진이 용인시청 및 공공기관의 데이터를 수집하여 최신 정보를 자동으로 업데이트합니다.
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
}

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
      paddingLeft: "4px"
    }}>
      <span style={{ fontSize: "32px" }}>{emoji}</span>
      <h2 style={{ fontSize: "26px", fontWeight: "900", color: "white", letterSpacing: "-0.5px" }}>{title}</h2>
    </div>
  );
}
