"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* 로고 영역 */}
        <Link href="/" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          textDecoration: "none",
          transition: "transform 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "28px" }}>🏘️</span>
          <span style={{ 
            fontSize: "20px", 
            fontWeight: 900, 
            background: "linear-gradient(135deg, #f97316 0%, #ed64a6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px"
          }}>
            용인시 생활 정보
          </span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav style={{ display: "flex", gap: "8px" }}>
          {[
            { name: "소개", href: "/about", emoji: "🏢" },
            { name: "블로그", href: "/blog", emoji: "📝" },
            { name: "문의", href: "/contact", emoji: "📧" },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#4b5563",
                padding: "8px 16px",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.color = "#111827";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#4b5563";
              }}
            >
              <span>{item.emoji}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
