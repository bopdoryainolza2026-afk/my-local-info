"use client";

import { useState } from "react";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

// 태그 색상 (필요 시 확장)
const tagStyle: Record<string, { bg: string; color: string }> = {
  "무료": { bg: "#dcfce7", color: "#166534" },
  "청년": { bg: "#dbeafe", color: "#1d4ed8" },
  "가족": { bg: "#fef3c7", color: "#92400e" },
  "복지": { bg: "#fce7f3", color: "#9d174d" },
};

function formatDate(dateStr: string) {
  if (!dateStr || dateStr === "상시") return "상시";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function dateRange(start: string, end: string) {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

/** 페이지 번호 버튼 UI */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: page === currentPage ? "2px solid #0ea5e9" : "1px solid #cbd5e1",
            background: page === currentPage ? "#0ea5e9" : "white",
            color: page === currentPage ? "white" : "#475569",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: page === currentPage ? "0 4px 10px rgba(14,165,233,0.35)" : "none",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

/** 행사 카드 */
function EventCard({
  emoji = "📍", tag = "정보", name, dateStr, location, target, summary, link, imageUrl,
}: {
  emoji?: string; tag?: string; name: string; dateStr: string;
  location: string; target: string; summary: string; link: string;
  imageUrl?: string;
}) {
  const isExternal = link.startsWith("http");
  const cardStyle: React.CSSProperties = {
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
    minHeight: "300px",
    cursor: "pointer",
  };

  const content = (
    <>
      {imageUrl ? (
        <div style={{ 
          width: "100%", 
          height: "160px", 
          borderRadius: "12px", 
          overflow: "hidden",
          marginBottom: "12px",
          position: "relative"
        }}>
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
          <span style={{ 
            position: "absolute", top: "10px", right: "10px",
            fontSize: 11, fontWeight: 700, padding: "3px 10px", 
            borderRadius: 20, background: "rgba(186, 230, 253, 0.9)", color: "#0369a1" 
          }}>
            {tag}
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>{emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#bae6fd", color: "#0369a1" }}>
            {tag}
          </span>
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {name}
      </h3>
      <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 700 }}>📅 {dateStr}</p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {summary}
      </p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
        <span>📍 {location}</span>
        <span>👤 {target}</span>
      </div>
    </>
  );

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer" style={cardStyle}>{content}</a>
  ) : (
    <Link href={link} style={cardStyle}>{content}</Link>
  );
}

/** 혜택 카드 */
function BenefitCard({
  emoji = "💰", tag = "혜택", name, target, amount, summary, deadline, link, imageUrl,
}: {
  emoji?: string; tag?: string; name: string; target: string;
  amount: string; summary: string; deadline: string; link: string;
  imageUrl?: string;
}) {
  const isExternal = link.startsWith("http");
  const cardStyle: React.CSSProperties = {
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
    minHeight: "300px",
    cursor: "pointer",
  };

  const content = (
    <>
      {imageUrl ? (
        <div style={{ 
          width: "100%", 
          height: "160px", 
          borderRadius: "12px", 
          overflow: "hidden",
          marginBottom: "12px",
          position: "relative"
        }}>
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
          <span style={{ 
            position: "absolute", top: "10px", right: "10px",
            fontSize: 11, fontWeight: 700, padding: "3px 10px", 
            borderRadius: 20, background: "rgba(252, 231, 243, 0.9)", color: "#9d174d" 
          }}>
            {tag}
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>{emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#fce7f3", color: "#9d174d" }}>
            {tag}
          </span>
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {name}
      </h3>
      {amount && <p style={{ fontSize: 13, color: "#db2777", fontWeight: 700 }}>💰 {amount}</p>}
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {summary}
      </p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
        <span>👤 {target.substring(0, 30)}{target.length > 30 ? "..." : ""}</span>
        <span>📅 {formatDate(deadline)}까지</span>
      </div>
    </>
  );

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer" style={cardStyle}>{content}</a>
  ) : (
    <Link href={link} style={cardStyle}>{content}</Link>
  );
}

/** 맛집 카드 */
function RestaurantCard({ emoji, name, menu, location, summary, link, tag, imageUrl }: any) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={{
      background: "white", borderRadius: 16, padding: "20px",
      border: "1px solid #fed7aa", boxShadow: "0 2px 8px rgba(234,179,8,0.1)",
      textDecoration: "none", color: "inherit", display: "flex",
      flexDirection: "column", gap: 10, minHeight: "300px",
    }}>
    <>
      {imageUrl ? (
        <div style={{ 
          width: "100%", 
          height: "160px", 
          borderRadius: "12px", 
          overflow: "hidden",
          marginBottom: "12px",
          position: "relative"
        }}>
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
          <span style={{ 
            position: "absolute", top: "10px", right: "10px",
            fontSize: 11, fontWeight: 700, padding: "3px 10px", 
            borderRadius: 20, background: "rgba(255, 237, 213, 0.9)", color: "#9a3412" 
          }}>
            {tag}
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>{emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#ffedd5", color: "#9a3412" }}>
            {tag}
          </span>
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {name}
      </h3>
      <p style={{ fontSize: 13, color: "#ea580c", fontWeight: 700 }}>🍴 {menu}</p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {summary}
      </p>
      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, marginTop: "auto" }}>
        📍 {location}
      </div>
    </>
    </a>
  );
}

/** 페이징이 적용된 이벤트 섹션 */
export function PagedEventSection({ items, allPosts }: { items: any[]; allPosts: any[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getLink = (item: any) => {
    const matched = allPosts.find(p => p.title?.includes(item.name) || item.name?.includes(p.title) || p.content?.includes(item.name));
    if (matched) return `/blog/${matched.slug}`;
    if (item.link && item.link !== "#") return item.link;
    return "/blog";
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
  };

  return (
    <div>
      <div style={gridStyle}>
        {paginated.map((ev: any) => (
          <EventCard
            key={ev.id}
            emoji={ev.emoji}
            tag={ev.tag}
            name={ev.name}
            dateStr={dateRange(ev.startDate, ev.endDate)}
            location={ev.location}
            target={ev.target}
            summary={ev.summary}
            link={getLink(ev)}
            imageUrl={ev.imageUrl}
          />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

/** 페이징이 적용된 혜택 섹션 */
export function PagedBenefitSection({ items, allPosts }: { items: any[]; allPosts: any[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getLink = (item: any) => {
    const matched = allPosts.find(p => p.title?.includes(item.name) || item.name?.includes(p.title) || p.content?.includes(item.name));
    if (matched) return `/blog/${matched.slug}`;
    if (item.link && item.link !== "#") return item.link;
    return "/blog";
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
  };

  return (
    <div>
      <div style={gridStyle}>
        {paginated.map((ben: any) => (
          <BenefitCard
            key={ben.id}
            emoji={ben.emoji}
            tag={ben.tag}
            name={ben.name}
            target={ben.target}
            amount={"amount" in ben ? ben.amount : ""}
            summary={ben.summary}
            deadline={ben.endDate}
            link={getLink(ben)}
            imageUrl={ben.imageUrl}
          />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

/** 페이징이 적용된 맛집 섹션 */
export function PagedRestaurantSection({ items }: { items: any[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  };

  return (
    <div>
      <div style={gridStyle}>
        {paginated.map((res: any) => (
          <RestaurantCard
            key={res.id}
            emoji={res.emoji}
            name={res.name}
            menu={res.menu}
            location={res.location}
            summary={res.summary}
            link={res.link}
            tag={res.tag}
            imageUrl={res.imageUrl}
          />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
