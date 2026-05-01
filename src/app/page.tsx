// Build Refresh: 2026-04-30-17-02
import Link from "next/link";
import localData from "../../public/data/local-info.json";
import { getSortedPostsData } from "@/lib/posts";
import RightSidebar from "@/components/RightSidebar";
import { PagedEventSection, PagedBenefitSection, PagedRestaurantSection, PagedStorySection, PagedEducationSection, PagedJobSection, PagedCultureSection } from "@/components/PagedSections";
import SearchBar from "@/components/SearchBar";
import AIRequestForm from "@/components/AIRequestForm";
import { ITEM_SLUG_MAP } from "@/lib/item-slug-map";

// 태그 색상 매핑
const tagStyle: Record<string, { bg: string; color: string }> = {
  "무료":  { bg: "#dcfce7", color: "#166534" },
  "청년":  { bg: "#dbeafe", color: "#1d4ed8" },
  "가족":  { bg: "#fef3c7", color: "#92400e" },
  "복지":  { bg: "#fce7f3", color: "#9d174d" },
};

// 날짜를 "4월 5일" 형식으로 바꿔주는 함수
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 날짜 범위 표시 (같은 날이면 하루만 표시)
function dateRange(start: string, end: string) {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

export default function Home() {
  const { events, benefits, restaurants, education, jobs, culture, lastUpdated, source } = localData;

  // 동네 이야기 모의 데이터 (사용자 참여 유도용)
  const neighborhoodStories = [
    {
      id: "story-001",
      name: "나만 알고 싶은 수지구 숲길 산책로 🌲",
      author: "용인토박이",
      summary: "성복동 어귀에 있는 작은 오솔길이에요. 아침 이슬 맞으며 걸으면 스트레스가 확 풀립니다. 사람도 별로 없어서 조용히 사색하기 좋아요.",
      date: "2026-04-24",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400",
      emoji: "🌲",
      tag: "산책로",
      link: "/blog/2026-04-24-yongin-walking-trail/"
    },
    {
      id: "story-002",
      name: "아이와 함께 가기 좋은 기흥구 카페 🍰",
      author: "워킹맘민지",
      summary: "보정동 카페거리에 있는 곳인데, 예스키즈존이라 눈치 안 보고 맛있는 케이크 먹고 왔어요. 마당에 작은 모래놀이장도 있더라고요!",
      date: "2026-04-23",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400",
      emoji: "🍰",
      tag: "카페",
      link: "/blog/2026-04-23-giheung-kids-cafe/"
    },
    {
      id: "story-003",
      name: "처인구 고택의 고즈넉한 봄날 🏯",
      author: "사진작가K",
      summary: "양지면에 있는 오래된 고택에 다녀왔습니다. 지금 딱 매화가 예쁘게 피어있어서 사진 찍기 너무 좋아요. 이번 주말 출사지로 강추!",
      date: "2026-04-22",
      imageUrl: "https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=400",
      emoji: "🏯",
      tag: "명소",
      link: "/blog/2026-04-22-yongin-hanok-spring/"
    },
    {
      id: "story-004",
      name: "기흥호수공원, 저녁 노을 맛집이에요 🌅",
      author: "호수산책러",
      summary: "기흥호수공원 둘레길이 정말 잘 되어 있더라고요. 해 질 녘에 가면 물결에 비친 노을이 환상적입니다. 가벼운 러닝 코스로도 추천해요!",
      date: "2026-04-25",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400",
      emoji: "🌅",
      tag: "산책",
      link: "/blog/2026-04-25-giheung-lake-sunset/"
    },
    {
      id: "story-005",
      name: "수지 신봉동 외식타운 단골집 공유 🥘",
      author: "미식가제이",
      summary: "주말마다 가족들과 찾는 신봉동 외식타운! 보리밥부터 코다리조림까지 메뉴가 정말 다양해서 좋아요. 주차도 편해서 자주 가게 되네요.",
      date: "2026-04-26",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
      emoji: "🥘",
      tag: "외식",
      link: "/blog/2026-04-26-suji-sinbong-food/"
    },
    {
      id: "story-006",
      name: "아이들과 가기 좋은 용인농촌테마파크 👨‍👩‍👧‍👦",
      author: "다둥이아빠",
      summary: "처인구에 있는 농촌테마파크에 다녀왔습니다. 계절마다 꽃도 예쁘고 원두막에서 도시락 먹기도 좋아요. 아이들 체험학습 장소로 딱입니다.",
      date: "2026-04-27",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
      emoji: "👨‍👩‍👧‍👦",
      tag: "나들이",
      link: "/blog/2026-04-27-yongin-rural-theme-park/"
    },
    {
      id: "story-007",
      name: "용인 자연휴양림에서 힐링하고 왔어요 🏕️",
      author: "캠핑마니아",
      summary: "예약하기 힘들기로 소문난 용인 자연휴양림! 숲속의 집에서 하룻밤 묵으니 공기가 정말 다르네요. 짚라인 체험도 아이들이 너무 좋아했어요.",
      date: "2026-04-28",
      imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=400",
      emoji: "🏕️",
      tag: "캠핑",
      link: "/blog/2026-04-28-yongin-forest-healing/"
    }
  ];


  // 오늘 날짜 가져오기 (비교용)
  const todayStr = new Date().toISOString().split('T')[0];

  // 용인시 포함 여부 검사 함수
  const isYongin = (item: any) => 
    (item.name && item.name.includes("용인")) || 
    (item.target && item.target.includes("용인")) || 
    (item.location && item.location.includes("용인"));

  // 데이터 정렬 및 필터링 로직
  const getActiveItems = (items: any[]) => {
    return items
      .filter(item => {
        // 종료일이 오늘보다 이전이면 제외 (이미 끝난 행사)
        const endDate = item.endDate || item.deadline || "9999-12-31";
        return endDate >= todayStr;
      })
      .sort((a, b) => {
        // 시작일이 미래인 것(곧 시작할 것)을 우선 순위로 배치
        const aStart = a.startDate || a.date || "0000-00-00";
        const bStart = b.startDate || b.date || "0000-00-00";
        
        const aIsFuture = aStart > todayStr;
        const bIsFuture = bStart > todayStr;

        if (aIsFuture && !bIsFuture) return -1;
        if (!aIsFuture && bIsFuture) return 1;

        // 둘 다 미래이거나 둘 다 진행 중이면 최신순(시작일 가까운 순)
        return aStart.localeCompare(bStart);
      });
  };

  // 용인시 전용 데이터 필터링 및 정렬 적용
  const yonginEvents = getActiveItems(events.filter(isYongin));
  const yonginBenefits = getActiveItems(benefits.filter(isYongin));

  const gyeonggiEvents = getActiveItems(events.filter((e) => !isYongin(e)));
  const gyeonggiBenefits = getActiveItems(benefits.filter((b) => !isYongin(b)));

  const yonginEdu = getActiveItems((education || []).filter(isYongin));
  const yonginJobs = getActiveItems((jobs || []).filter(isYongin));
  const yonginCulture = getActiveItems((culture || []).filter(isYongin));

  // 모든 블로그 포스트 가져오기
  const allPosts = getSortedPostsData();

  // 각 데이터 항목에 맞는 블로그 글 주소를 찾아주는 함수
  const getItemLink = (item: any) => {
    // [추가] 하드코딩 매핑 테이블 확인 (가장 정확함)
    const mappedSlug = ITEM_SLUG_MAP[item.id];
    if (mappedSlug) return `/blog/${mappedSlug}`;

    // 1. 블로그 글 중에서 아이템 ID 혹은 제목이 포함된 글 찾기 (보조 로직)
    const matchedPost = allPosts.find(post => {
      const cleanContent = post.content.replace(/\s+/g, "");
      const searchId = `[ITEM_ID:${item.id}]`;
      return cleanContent.includes(searchId) ||
             (item.id && post.content.includes(item.id)) ||
             (item.name && post.title.includes(item.name));
    });
    
    if (matchedPost) {
      return `/blog/${matchedPost.slug}`;
    }

    // 2. 블로그 글이 없으면 블로그 목록 페이지로 이동 (원문 링크로 바로 가지 않음)
    return "/blog";
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif", background: "transparent", minHeight: "100vh", color: "#f8fafc" }}>
      {/* ===== 2단: 화이트 네비게이션 바 (상단 고정) ===== */}
      <MainNavbar />
      
      {/* ===== 실시간 정보 바 (날씨/교통) ===== */}
      <LiveInfoBar />

      {/* ===== 히어로 섹션 (깔끔한 화이트/블루 테마) ===== */}
      <CleanHero />

      {/* ===== 본문 영역 (본문 + 사이드바) ===== */}
      <main style={{ 
        maxWidth: 1100, 
        margin: "40px auto 0", 
        padding: "0 16px 60px",
        display: "flex",
        gap: "32px",
        flexWrap: "wrap", 
        justifyContent: "center",
        alignItems: "flex-start"
      }}>

        {/* 1. 왼쪽 본문 영역 */}
        <div style={{ flex: "1 1 700px", maxWidth: "800px" }}>
          
          <section id="events" style={{ scrollMarginTop: 80, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="🎪" title="이번 달 행사/축제" />
            <PagedEventSection items={yonginEvents} allPosts={allPosts} />
          </section>

          {/* ---- 지원금/혜택 섹션 ---- */}
          <section id="benefits" style={{ scrollMarginTop: 80, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="💰" title="지원금/혜택" />
            <PagedBenefitSection items={yonginBenefits} allPosts={allPosts} />
          </section>

          {/* ---- 교육/강좌 섹션 (신규) ---- */}
          <section id="education" style={{ scrollMarginTop: 80, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="🎓" title="배움의 즐거움, 교육/강좌" />
            <PagedEducationSection items={yonginEdu} allPosts={allPosts} />
          </section>

          {/* ---- 일자리 섹션 (신규) ---- */}
          <section id="jobs" style={{ scrollMarginTop: 80, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="👔" title="새로운 시작, 일자리 소식" />
            <PagedJobSection items={yonginJobs} allPosts={allPosts} />
          </section>

          {/* ---- 문화/예술 섹션 (신규) ---- */}
          <section id="culture" style={{ scrollMarginTop: 80, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="🎨" title="풍요로운 일상, 문화/예술" />
            <PagedCultureSection items={yonginCulture} allPosts={allPosts} />
          </section>


          <section id="restaurants" style={{ marginTop: 20, marginBottom: 50, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="🍱" title="우리동네 추천 맛집" />
            <PagedRestaurantSection items={restaurants as any[]} allPosts={allPosts} />
          </section>

          {/* ---- 나만의 용인, 우리 동네 이야기 섹션 (개편) ---- */}
          <section id="stories" style={{ marginTop: 20, marginBottom: 50, scrollMarginTop: 80, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
              <SectionTitle emoji="🏠" title="나만의 용인, 우리 동네 이야기" />
            </div>
            

            <PagedStorySection items={neighborhoodStories} />
          </section>

          {/* ---- AI 기자 취재 요청 및 소통 섹션 (개편) ---- */}
          <section id="community" style={{ marginTop: 20, marginBottom: 50, scrollMarginTop: 80, background: "rgba(0,0,0,0.15)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <SectionTitle emoji="💬" title="AI 기자와 함께하는 소통마당" />
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(12px)",
              borderRadius: 20,
              padding: "32px 24px",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <p style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "12px", fontWeight: 800 }}>
                  궁금한 용인 소식, AI 기자에게 요청하세요! 🕵️‍♂️
                </p>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6 }}>
                  우리 동네 맛집, 행사, 정책 등 궁금한 점을 남겨주시면 <br />
                  <b>AI 블로그 매니저</b>가 인터넷을 샅샅이 뒤져 내일 아침 리포트를 작성해 드립니다.
                </p>
              </div>
              
              <AIRequestForm />
            </div>
          </section>

        {/* ---- 블로그 배너 ---- */}
        <div id="blog" style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: "28px 24px",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 20,
          scrollMarginTop: 80,
        }}>
          <div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>✨ Gemini AI 자동 작성</p>
            <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>생활 정보 블로그 읽기</p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>AI가 매일 아침 유용한 정보를 글로 정리해 드려요.</p>
          </div>
          <Link href="/blog" style={{
            background: "#0ea5e9", color: "white",
            padding: "10px 22px", borderRadius: 30,
            fontWeight: 700, fontSize: 14, flexShrink: 0,
            boxShadow: "0 4px 12px rgba(14,165,233,0.5)",
            textDecoration: "none",
          }}>
            블로그 보기 →
          </Link>
        </div>

        </div> {/* 1. 왼쪽 본문 영역 끝 */}

        {/* 2. 오른쪽 사이드바 영역 */}
        <RightSidebar />

      </main>

      {/* ===== 푸터 ===== */}
      <footer style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        color: "#94a3b8",
        padding: "32px 20px",
        textAlign: "center",
        fontSize: 13,
        lineHeight: 1.8,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 20 }}>
          <Link href="/privacy" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>개인정보 처리방침</Link>
          <Link href="/about" style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}>사이트 소개</Link>
        </div>

        {/* 방문자 카운터 버튼 */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            padding: "8px 16px", 
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "12px" }}>📊 방문자 현황</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>오늘</span>
              <img 
                src={`https://visitor-badge.laobi.icu/badge?page_id=yongin-love-info.com.${new Date().toISOString().split('T')[0]}&color=0ea5e9`}
                alt="Today Hits"
                style={{ verticalAlign: "middle" }}
              />
              <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "4px" }}>누계</span>
              <img 
                src="https://visitor-badge.laobi.icu/badge?page_id=yongin-love-info.com&color=1e293b" 
                alt="Total Hits"
                style={{ verticalAlign: "middle" }}
              />
            </div>
          </div>
        </div>

        <p>🏛️ 데이터 출처: <span style={{ color: "#cbd5e1" }}>{source}</span></p>
        <p>🕐 마지막 업데이트: <span style={{ color: "#cbd5e1" }}>{lastUpdated}</span></p>
        <p style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
          본 사이트는 공공데이터를 활용해 자동으로 제작됩니다. 정확한 정보는 원본 출처를 확인하세요.
        </p>
      </footer>

    </div>
  );
}

/* ========================
   하위 컴포넌트들
 ======================== */

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>{title}</h2>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  const s = tagStyle[label] || { bg: "#f0f9ff", color: "#0369a1" };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      background: s.bg, color: s.color,
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function EventCard({
  emoji = "📍", tag = "정보", name, dateStr, location, target, summary, link, rawStartDate, rawEndDate,
}: {
  emoji?: string; tag?: string; name: string; dateStr: string;
  location: string; target: string; summary: string; link: string;
  rawStartDate?: string; rawEndDate?: string;
}) {
  return (
    <Link href={link} style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
      textDecoration: "none",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minHeight: "300px", // 높이 고정
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <span style={{ 
          fontSize: 11, fontWeight: 700, 
          padding: "3px 10px", borderRadius: 20, 
          background: "#bae6fd", color: "#0369a1" 
        }}>{tag}</span>
      </div>
      <h3 style={{ 
        fontSize: 17, 
        fontWeight: 800, 
        color: "#1e293b",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 700 }}>📅 {dateStr}</p>
      <p style={{ 
        fontSize: 13, 
        color: "#64748b", 
        lineHeight: 1.5, 
        flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden" 
      }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
        <span>📍 {location}</span>
        <span>👤 {target}</span>
      </div>
    </Link>
  );
}

function BenefitCard({
  emoji = "💰", tag = "혜택", name, target, amount, summary, deadline, link,
}: {
  emoji?: string; tag?: string; name: string; target: string;
  amount: string; summary: string; deadline: string; link: string;
}) {
  return (
    <Link href={link} style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
      textDecoration: "none",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minHeight: "300px", // 높이 고정
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <span style={{ 
          fontSize: 11, fontWeight: 700, 
          padding: "3px 10px", borderRadius: 20, 
          background: "#fce7f3", color: "#9d174d" 
        }}>{tag}</span>
      </div>
      <h3 style={{ 
        fontSize: 17, 
        fontWeight: 800, 
        color: "#1e293b",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#db2777", fontWeight: 700 }}>💰 {amount}</p>
      <p style={{ 
        fontSize: 13, 
        color: "#64748b", 
        lineHeight: 1.5, 
        flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden" 
      }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
        <span>👤 {target}</span>
        <span>📅 {formatDate(deadline)}까지</span>
      </div>
    </Link>
  );
}

function RestaurantCard({ emoji, name, menu, location, summary, blogLink, tag }: any) {
  return (
    <Link href={blogLink} style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)",
      textDecoration: "none",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: "300px", // 높이 고정
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <span style={{ 
          fontSize: 11, fontWeight: 700, 
          padding: "3px 10px", borderRadius: 20, 
          background: "#ffedd5", color: "#9a3412" 
        }}>{tag}</span>
      </div>
      <h3 style={{ 
        fontSize: 17, 
        fontWeight: 800, 
        color: "#1e293b",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#ea580c", fontWeight: 700 }}>🍴 {menu}</p>
      <p style={{ 
        fontSize: 13, 
        color: "#64748b", 
        lineHeight: 1.5, 
        flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden" 
      }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, marginTop: "auto" }}>
        📍 {location}
      </div>
    </Link>
  );
}

function LiveInfoBar() {
  return (
    <div style={{
      background: "rgba(42, 56, 84, 0.6)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      padding: "8px 20px"
    }}>
      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: "#cbd5e1"
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span>☀️ <b>용인시 날씨:</b> 맑음 (18°C)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            🚗 <b>교통 상황:</b> <span style={{ color: "#22c55e", fontWeight: 700 }}>원활</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 10 }}>
            📊 <b>방문자</b> 
            <span style={{ fontSize: "11px", color: "#64748b" }}>오늘</span>
            <img 
              src={`https://visitor-badge.laobi.icu/badge?page_id=yongin-love-info.com.${new Date().toISOString().split('T')[0]}&color=0ea5e9`}
              alt="Today"
              style={{ height: "18px" }}
            />
            <span style={{ fontSize: "11px", color: "#64748b" }}>누계</span>
            <img 
              src="https://visitor-badge.laobi.icu/badge?page_id=yongin-love-info.com&color=475569" 
              alt="Total"
              style={{ height: "18px" }}
            />
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="https://www.its.go.kr/" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
            실시간 CCTV 보기 →
          </a>
        </div>
      </div>
    </div>
  );
}


function MainNavbar() {
  const menus = [
    { name: "🎪 행사/축제", id: "#events" },
    { name: "💰 지원금", id: "#benefits" },
    { name: "🎓 교육", id: "#education" },
    { name: "👔 일자리", id: "#jobs" },
    { name: "🎨 문화", id: "#culture" },
    { name: "🍱 맛집", id: "#restaurants" },
    { name: "🏠 이야기", id: "#stories" },
    { name: "💬 소통", id: "#community" },
    { name: "📝 Blog", id: "#blog" },
  ];

  return (
    <nav style={{
      background: "rgba(42, 56, 84, 0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      height: "70px",
      display: "flex",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
      padding: "0 24px"
    }}>
      <div style={{
        maxWidth: "1350px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px"
      }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: "20px", fontWeight: 900, color: "#f8fafc", letterSpacing: "-1px" }}>
            🏛️ 용인시 <span style={{ color: "#06b6d4" }}>포털 정보사이트</span>
          </span>
        </Link>

        {/* 중앙 메뉴 버튼들 (imweb 스타일) */}
        <div style={{ display: "flex", gap: "16px", flexShrink: 1, overflow: "hidden" }}>
          {menus.map((m) => (
            <a key={m.id} href={m.id} style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#cbd5e1",
              textDecoration: "none",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
              ":hover": { color: "#06b6d4" }
            } as any}>
              {m.name}
            </a>
          ))}
        </div>

        {/* 우측 용인시청 퀵링크 */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "none" }}>용인시청 통합 바로가기</span>
          <div style={{ display: "flex", gap: "4px", background: "#f8fafc", padding: "4px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <a href="https://www.yongin.go.kr" target="_blank" rel="noreferrer" style={{ 
              textDecoration: "none", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", 
              fontWeight: 800, color: "#475569", background: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              whiteSpace: "nowrap"
            }}>용인시청 이동</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function CleanHero() {
  return (
    <div style={{ padding: "0 20px" }}>
      <section style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(12px)",
        margin: "40px auto",
        maxWidth: "1000px",
        borderRadius: "32px",
        padding: "70px 20px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderTop: "1px solid rgba(255,255,255,0.25)"
      }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#06b6d4", marginBottom: "12px", letterSpacing: "1px", textShadow: "0 0 10px rgba(6,182,212,0.5)" }}>
          YONGIN LOCAL GUIDE
        </p>
        <h1 style={{ fontSize: "38px", fontWeight: 900, color: "#f8fafc", marginBottom: "20px", lineHeight: 1.3 }}>
          어제 나온 혜택부터 오늘 열리는 축제까지,<br />
          용인의 <span style={{ color: "#06b6d4", textShadow: "0 0 15px rgba(6,182,212,0.5)" }}>모든 것</span>을 한눈에!
        </h1>
        <p style={{ fontSize: "17px", color: "#cbd5e1", marginBottom: "32px", lineHeight: 1.6 }}>
          용인의 실시간 축제부터 이웃들이 직접 전하는 숨은 명소까지<br />
          매일 아침 AI와 이웃들이 정성껏 모아 전달해 드립니다.
        </p>

        <div style={{ marginBottom: "40px" }}>
          <SearchBar />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="#events" style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)", color: "white",
            padding: "14px 28px", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            boxShadow: "0 4px 12px rgba(6,182,212,0.4)"
          }}>
            오늘의 행사 확인하기
          </a>
          <a href="#benefits" style={{
            background: "rgba(255,255,255,0.05)", color: "#f8fafc",
            backdropFilter: "blur(10px)",
            padding: "14px 28px", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}>
            맞춤 혜택 찾기
          </a>
        </div>
      </div>
    </section>
  </div>
  );
}
