import Link from "next/link";
import localData from "../../public/data/local-info.json";
import AdBanner from "@/components/AdBanner";
import RightSidebar from "@/components/RightSidebar";

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
  const { events, benefits, restaurants, lastUpdated, source } = localData;

  // 용인시 포함 여부 검사 함수
  const isYongin = (item: any) => 
    (item.name && item.name.includes("용인")) || 
    (item.target && item.target.includes("용인")) || 
    (item.location && item.location.includes("용인"));

  // 용인시 전용 데이터
  const yonginEvents = events.filter(isYongin);
  const yonginBenefits = benefits.filter(isYongin);

  // 용인시 제외 기타(경기도/전국) 데이터
  const gyeonggiEvents = events.filter((e) => !isYongin(e));
  const gyeonggiBenefits = benefits.filter((b) => !isYongin(b));

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Inter', sans-serif", background: "#f0f9ff", minHeight: "100vh" }}>

      {/* ===== 1단: 최상단 광고 배너 (3cm/110px 높이) ===== */}
      <TopAdBanner />

      {/* ===== 2단: 화이트 네비게이션 바 (상단 고정) ===== */}
      <MainNavbar />
      
      {/* ===== 실시간 정보 바 (날씨/교통) ===== */}
      <LiveInfoBar />

      {/* ===== 히어로 섹션 (깔끔한 화이트/블루 테마) ===== */}
      <CleanHero />

      {/* ===== 본문 영역 (본문 + 사이드바) ===== */}
      <main style={{ 
        maxWidth: 1300, 
        margin: "40px auto 0", 
        padding: "0 16px 60px",
        display: "flex",
        gap: "32px",
        flexWrap: "wrap", 
        justifyContent: "center",
        alignItems: "flex-start"
      }}>

        {/* 1. 왼쪽 본문 영역 */}
        <div style={{ flex: "1 1 700px", maxWidth: "1000px" }}>
          
          {/* ---- 이번 달 행사/축제 섹션 (3열 그리드 전면 개편) ---- */}
          <section id="events" style={{ scrollMarginTop: 80, marginBottom: 50 }}>
            <SectionTitle emoji="🎪" title="이번 달 행사/축제" />
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: 24 
            }}>
              {yonginEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  emoji={ev.emoji}
                  tag={ev.tag}
                  name={ev.name}
                  dateStr={dateRange(ev.startDate, ev.endDate)}
                  rawStartDate={ev.startDate}
                  rawEndDate={ev.endDate}
                  location={ev.location}
                  target={ev.target}
                  summary={ev.summary}
                  link="/blog"
                />
              ))}
            </div>
          </section>

          {/* ---- 지원금/혜택 섹션 (3열 그리드 전면 개편) ---- */}
          <section id="benefits" style={{ scrollMarginTop: 80, marginBottom: 50 }}>
            <SectionTitle emoji="💰" title="지원금/혜택" />
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: 24 
            }}>
              {yonginBenefits.map((ben) => (
                <BenefitCard
                  key={ben.id}
                  emoji={ben.emoji}
                  tag={ben.tag}
                  name={ben.name}
                  target={ben.target}
                  amount={"amount" in ben ? (ben as typeof ben & { amount: string }).amount : ""}
                  summary={ben.summary}
                  deadline={ben.endDate}
                  link="/blog"
                />
              ))}
            </div>
          </section>

        <AdBanner />

        {/* ---- 경기도 모아보기 섹션 (3열 그리드 전면 개편) ---- */}
        {(gyeonggiEvents.length > 0 || gyeonggiBenefits.length > 0) && (
          <section id="gyeonggi-info" style={{ marginBottom: 50, marginTop: 40 }}>
            <SectionTitle emoji="📢" title="경기도 모아보기" />
            
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {/* 경기도 행사/축제 (3열 그리드) */}
              {gyeonggiEvents.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0284c7", marginBottom: 16, paddingLeft: 4 }}>🎪 행사/축제</h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                    gap: 24 
                  }}>
                    {gyeonggiEvents.map((ev) => (
                      <EventCard
                        key={ev.id}
                        emoji={ev.emoji}
                        tag={ev.tag}
                        name={ev.name}
                        dateStr={dateRange(ev.startDate, ev.endDate)}
                        rawStartDate={ev.startDate}
                        rawEndDate={ev.endDate}
                        location={ev.location}
                        target={ev.target}
                        summary={ev.summary}
                        link="/blog"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* 경기도 지원금/혜택 (3열 그리드) */}
              {gyeonggiBenefits.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0284c7", marginBottom: 16, paddingLeft: 4 }}>💰 지원금/혜택</h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                    gap: 24 
                  }}>
                    {gyeonggiBenefits.map((ben) => (
                      <BenefitCard
                        key={ben.id}
                        emoji={ben.emoji}
                        tag={ben.tag}
                        name={ben.name}
                        target={ben.target}
                        amount={"amount" in ben ? (ben as typeof ben & { amount: string }).amount : ""}
                        summary={ben.summary}
                        deadline={ben.endDate}
                        link="/blog"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}


        {/* ---- 우리동네 맛집 섹션 ---- */}
        <section id="restaurants" style={{ marginTop: 40, marginBottom: 40 }}>
          <SectionTitle emoji="🍱" title="우리동네 추천 맛집" />
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: 20 
          }}>
            {restaurants && restaurants.map((res: any) => (
              <RestaurantCard 
                key={res.id}
                emoji={res.emoji}
                name={res.name}
                menu={res.menu}
                location={res.location}
                summary={res.summary}
                link={res.link}
                tag={res.tag}
              />
            ))}
          </div>
        </section>

        {/* ---- 블로그 배너 (맨 하단 이동) ---- */}
        <div id="blog" style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: 16,
          padding: "28px 24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 40,
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
        background: "#1e293b",
        color: "#94a3b8",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 13,
        lineHeight: 1.8,
      }}>
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
      background: "white",
      borderRadius: 16,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #bae6fd",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{title}</h2>
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
      background: "white",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid #bae6fd",
      boxShadow: "0 2px 8px rgba(14,165,233,0.06)",
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      gap: 12,
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
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 700 }}>📅 {dateStr}</p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1 }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
      background: "white",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid #e0f2fe",
      boxShadow: "0 2px 8px rgba(125,211,252,0.08)",
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      gap: 12,
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
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#db2777", fontWeight: 700 }}>💰 {amount}</p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1 }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span>👤 {target}</span>
        <span>📅 {formatDate(deadline)}까지</span>
      </div>
    </Link>
  );
}

function RestaurantCard({ emoji, name, menu, location, summary, link, tag }: any) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={{
      background: "white",
      borderRadius: 16,
      padding: "20px",
      border: "1px solid #fed7aa",
      boxShadow: "0 2px 8px rgba(234,179,8,0.1)",
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <span style={{ 
          fontSize: 11, fontWeight: 700, 
          padding: "3px 10px", borderRadius: 20, 
          background: "#ffedd5", color: "#9a3412" 
        }}>{tag}</span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#ea580c", fontWeight: 700 }}>🍴 {menu}</p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{summary}</p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
        📍 {location}
      </div>
    </a>
  );
}

function LiveInfoBar() {
  return (
    <div style={{
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
      padding: "8px 20px"
    }}>
      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: "#475569"
      }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span>☀️ <b>용인시 날씨:</b> 맑음 (18°C)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            🚗 <b>교통 상황:</b> <span style={{ color: "#22c55e", fontWeight: 700 }}>원활</span>
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

function TopAdBanner() {
  return (
    <div style={{
      height: "72px", 
      background: "#f3f4f6",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        color: "#4b5563",
        fontSize: "14px",
        fontWeight: 600
      }}>
        <span style={{ fontSize: "20px" }}>🎁</span>
        <span>여기에 화려한 **배너 광고**가 들어올 자리입니다. (높이 72px)</span>
      </div>
      <button style={{
        position: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        color: "#9ca3af"
      }}>×</button>
    </div>
  );
}

function MainNavbar() {
  const menus = [
    { name: "🎪 행사/축제", id: "#events" },
    { name: "💰 지원금/혜택", id: "#benefits" },
    { name: "🍱 지역맛집", id: "#restaurants" },
    { name: "📝 Blog", id: "#blog" },
  ];

  return (
    <nav style={{
      background: "white",
      height: "70px",
      display: "flex",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
      padding: "0 24px"
    }}>
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: "20px", fontWeight: 900, color: "#1e293b", letterSpacing: "-1px" }}>
            🏘️ 용인시 <span style={{ color: "#0ea5e9" }}>생활정보</span>
          </span>
        </Link>

        {/* 중앙 메뉴 버튼들 (imweb 스타일) */}
        <div style={{ display: "flex", gap: "28px" }}>
          {menus.map((m) => (
            <a key={m.id} href={m.id} style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#475569",
              textDecoration: "none",
              transition: "color 0.2s",
              ":hover": { color: "#0ea5e9" }
            } as any}>
              {m.name}
            </a>
          ))}
        </div>

        {/* 우측 빈 공간 (메뉴 중앙 유지를 위해 필요 시 활용) */}
        <div style={{ width: "100px", display: "none" }}></div>
      </div>
    </nav>
  );
}

function CleanHero() {
  return (
    <section style={{
      background: "white",
      padding: "60px 20px 80px",
      textAlign: "center",
      borderBottom: "1px solid #f1f5f9"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#0ea5e9", marginBottom: "12px", letterSpacing: "1px" }}>
          YONGIN LOCAL GUIDE
        </p>
        <h1 style={{ fontSize: "38px", fontWeight: 900, color: "#0f172a", marginBottom: "20px", lineHeight: 1.3 }}>
          똑똑한 용인 생활의 시작,<br />
          <span style={{ color: "#0ea5e9" }}>모든 정보</span>를 한눈에 확인하세요.
        </h1>
        <p style={{ fontSize: "17px", color: "#64748b", marginBottom: "32px", lineHeight: 1.6 }}>
          용인시의 실시간 축제부터 정부 지원금, 현지인 추천 맛집까지<br />
          매일 아침 AI가 정성껏 모아 전달해 드립니다.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="#events" style={{
            background: "#1e293b", color: "white",
            padding: "14px 28px", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            오늘의 행사 확인하기
          </a>
          <a href="#benefits" style={{
            background: "#f1f5f9", color: "#475569",
            padding: "14px 28px", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            border: "1px solid #e2e8f0"
          }}>
            맞춤 혜택 찾기
          </a>
        </div>
      </div>
    </section>
  );
}
