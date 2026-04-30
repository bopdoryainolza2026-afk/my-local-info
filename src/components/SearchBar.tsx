"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "궁금한 정보를 검색해보세요 (예: 축제, 지원금)", initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      style={{
        display: "flex",
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        position: "relative",
        boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.15)",
        borderRadius: "16px",
        overflow: "hidden"
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "16px 24px",
          paddingRight: "60px",
          fontSize: "16px",
          border: "2px solid #e2e8f0",
          borderRadius: "16px",
          outline: "none",
          transition: "all 0.2s",
          fontFamily: "inherit"
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />
      <button
        type="submit"
        style={{
          position: "absolute",
          right: "8px",
          top: "8px",
          bottom: "8px",
          width: "48px",
          background: "#0ea5e9",
          border: "none",
          borderRadius: "12px",
          color: "white",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s"
        }}
      >
        🔍
      </button>
    </form>
  );
}
