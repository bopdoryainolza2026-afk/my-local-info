import Link from "next/link";
import localData from "../../public/data/local-info.json";
import AdBanner from "@/components/AdBanner";

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
  const { events, benefits, lastUpdated, source } = localData;

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
          maxWidth: 1000,
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

      {/* ===== 히어로 배너 ===== */}
      <section style={{
        background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 60%, #7dd3fc 100%)",
        padding: "40px 20px 56px",
        textAlign: "center",
        color: "white",
      }}>
        <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>
          📡 공공데이터 자동 수집 · AI 매일 업데이트
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.4, marginBottom: 10 }}>
          우리 동네 행사·지원금<br />한 곳에서 확인하세요!
        </h1>
        <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 24 }}>
          용인시 행사, 축제, 지원금 정보를 매일 자동으로 모아드립니다.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#events" style={{
            background: "white", color: "#0ea5e9",
            padding: "10px 20px", borderRadius: 30,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            🎪 행사 보기
          </a>
          <a href="#benefits" style={{
            background: "rgba(255,255,255,0.2)", color: "white",
            padding: "10px 20px", borderRadius: 30,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.4)",
          }}>
            💰 지원금 보기
          </a>
        </div>
      </section>

      {/* ===== 본문 ===== */}
      <main style={{ maxWidth: 1000, margin: "-20px auto 0", padding: "0 16px 60px" }}>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", 
          gap: 24,
          marginBottom: 40,
          alignItems: "start"
        }}>
          {/* ---- 행사/축제 섹션 ---- */}
          <section id="events" style={{ scrollMarginTop: 80 }}>
            <SectionTitle emoji="🎪" title="이번 달 행사/축제" />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {events.map((ev) => (
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

          {/* ---- 지원금/혜택 섹션 ---- */}
          <section id="benefits" style={{ scrollMarginTop: 80 }}>
            <SectionTitle emoji="💰" title="지원금/혜택" />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {benefits.map((ben) => (
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
        </div>

        <AdBanner />

        {/* ---- 블로그 배너 ---- */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: 16,
          padding: "28px 24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
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
      display: "block",
      textDecoration: "none",
      color: "inherit",
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <Tag label={tag} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: "#1e293b" }}>{name}</h3>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10, lineHeight: 1.6 }}>{summary}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13, color: "#0284c7", fontWeight: 600 }}>
        <span>📅 {dateStr}</span>
        <span>📍 {location}</span>
        <span>👤 {target}</span>
      </div>
      <div style={{ marginTop: 14, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#0284c7" }}>
        자세히 보기 →
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": name,
            "startDate": rawStartDate || dateStr,
            "endDate": rawEndDate || dateStr,
            "location": { "@type": "Place", "name": location },
            "description": summary
          })
        }}
      />
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
      display: "flex",
      gap: 16,
      textDecoration: "none",
      color: "inherit",
      alignItems: "flex-start",
      cursor: "pointer",
    }}>
      <span style={{ fontSize: 36, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>{name}</h3>
          <Tag label={tag} />
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8, lineHeight: 1.6 }}>{summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13 }}>
          <span style={{ color: "#0284c7", fontWeight: 700 }}>💵 {amount}</span>
          <span style={{ color: "#64748b" }}>👤 {target}</span>
          <span style={{ color: "#64748b" }}>📅 {formatDate(deadline)}까지</span>
        </div>
        <div style={{ marginTop: 14, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#0284c7" }}>
          자세히 보기 →
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentService",
              "name": name,
              "description": summary,
              "provider": { "@type": "GovernmentOrganization", "name": "공공기관" }
            })
          }}
        />
      </div>
    </Link>
  );
}
