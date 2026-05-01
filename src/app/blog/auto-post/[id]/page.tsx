import React from "react";
import Link from "next/link";
import localData from "../../../../../public/data/local-info.json";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSortedPostsData } from "@/lib/posts";

export function generateStaticParams() {
  const allItems = [
    ...localData.events, 
    ...localData.benefits, 
    ...localData.restaurants,
    ...(localData.education || []),
    ...(localData.jobs || []),
    ...(localData.culture || [])
  ];
  return allItems.map((item: any) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const allItems = [
    ...localData.events, 
    ...localData.benefits, 
    ...localData.restaurants,
    ...(localData.education || []),
    ...(localData.jobs || []),
    ...(localData.culture || [])
  ];
  const item = allItems.find((i: any) => i.id === id);
  
  return {
    title: item ? `${item.name} - 상세 정보` : "정보를 찾을 수 없습니다",
    description: item ? item.summary : "요청하신 정보를 찾을 수 없습니다.",
  };
}

export default function AutoPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // 모든 데이터 통합
  const allItems = [
    ...(localData.events as any[]),
    ...(localData.benefits as any[]),
    ...(localData.restaurants as any[]),
    ...(localData.education || [] as any[]),
    ...(localData.jobs || [] as any[]),
    ...(localData.culture || [] as any[])
  ];
  
  const item = allItems.find((i: any) => i.id === id);

  // 블로그 글이 있는지 확인
  const allPosts = getSortedPostsData();
  const matchedPost = allPosts.find(p => {
    const cleanContent = p.content.replace(/\s+/g, "");
    const searchId = `[ITEM_ID:${id}]`;
    return cleanContent.includes(searchId) || p.content.includes(id);
  });

  // 블로그 글이 있으면 즉시 리다이렉트
  if (matchedPost) {
    redirect(`/blog/${matchedPost.slug}`);
  }

  if (!item) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>🚫 정보를 찾을 수 없습니다</h1>
        <p>요청하신 데이터 ID(${id})에 해당하는 정보가 없습니다.</p>
        <Link href="/" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: "bold" }}>홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* 헤더 */}
      <header style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
        padding: "40px 20px",
        color: "white",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(14,165,233,0.2)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>🏠 홈으로 돌아가기</Link>
          <div style={{ fontSize: "48px", marginTop: "20px", marginBottom: "10px" }}>{item.emoji || "ℹ️"}</div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "16px" }}>{item.name}</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>{item.summary}</p>
        </div>
      </header>

      {/* 본문 */}
      <main style={{ maxWidth: "800px", margin: "-30px auto 60px", padding: "0 20px" }}>
        <div style={{ 
          background: "white", 
          borderRadius: "24px", 
          padding: "40px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0"
        }}>
          
          <div style={{ 
            padding: "20px", 
            background: "#f8fafc", 
            borderRadius: "16px", 
            border: "1px solid #e2e8f0",
            textAlign: "center",
            marginBottom: "40px"
          }}>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px", fontWeight: 600 }}>
              이 정보의 상세한 블로그 이야기를 준비하고 있습니다.<br/>
              조금만 기다려주시면 유익한 포스팅으로 찾아뵙겠습니다!
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/blog" style={{ 
                display: "inline-block", fontSize: "15px", fontWeight: 800, 
                color: "white", background: "#1e293b", 
                padding: "12px 24px", 
                borderRadius: "50px", textDecoration: "none",
                boxShadow: "0 4px 12px rgba(30,41,59,0.1)",
              }}>
                🏠 블로그 목록 가기
              </Link>
              {(() => {
                let link = item.link || "https://www.yongin.go.kr";
                let text = "🔗 자세한 내용 원문 확인하기";
                
                // 청년 LAB 관련 하드코딩 및 키워드 매칭
                const youthKeywords = ["youth", "청년", "lab", "lab", "이사비", "주거", "전월세", "보증금", "월세", "꿈드림"];
                const isYouth = youthKeywords.some(k => id.toLowerCase().includes(k) || item.name.toLowerCase().includes(k));

                if (isYouth || id.includes("edu-002")) {
                  link = "https://youth.yongin.go.kr";
                  text = "🔗 용인청년 Lab 공식 홈페이지 가기";
                }

                return (
                  <a href={link} target="_blank" rel="noopener noreferrer" style={{ 
                    display: "inline-block", fontSize: "15px", fontWeight: 800, 
                    color: "white", background: "#0ea5e9", 
                    padding: "12px 24px", 
                    borderRadius: "50px", textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
                  }}>
                    {text}
                  </a>
                );
              })()}
            </div>
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", marginBottom: "20px", borderLeft: "5px solid #0ea5e9", paddingLeft: "15px" }}>
            📋 상세 안내
          </h2>

          <div style={{ display: "grid", gap: "24px" }}>
            <InfoRow label="📍 위치/장소" value={item.location} />
            {"startDate" in item && <InfoRow label="📅 기간" value={`${item.startDate} ~ ${item.endDate}`} />}
            {"target" in item && <InfoRow label="👤 대상" value={item.target} />}
            {"amount" in item && <InfoRow label="💰 지원 혜택" value={item.amount} />}
            {"menu" in item && <InfoRow label="🍴 추천 메뉴" value={item.menu} />}
          </div>

          <div style={{ marginTop: "50px", paddingTop: "30px", borderTop: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8 }}>
              현재 보시는 글은 인공지능 기자가 해당 정보를 바탕으로 자동 생성한 요약 페이지입니다. 
              더 상세하고 풍부한 내용이 담긴 블로그 포스팅은 현재 AI가 작성 중이거나 업데이트 대기 중일 수 있습니다. 
              <br /><br />
              정확한 신청 기간이나 구체적인 조건은 반드시 위의 <b>[원본 웹사이트 보기]</b> 버튼을 통해 주관 기관의 공식 공고문을 확인해 주시기 바랍니다.
            </p>
          </div>
        </div>

        {/* 하단 배너 */}
        <div style={{ 
          marginTop: "30px", 
          textAlign: "center", 
          padding: "20px", 
          background: "#1e293b", 
          borderRadius: "16px",
          color: "white"
        }}>
          <p style={{ margin: 0, fontSize: "14px" }}>🏠 다른 정보도 더 확인해 보시겠어요?</p>
          <Link href="/" style={{ color: "#38bdf8", fontWeight: "bold", textDecoration: "none", marginTop: "10px", display: "inline-block" }}>
            메인 페이지로 돌아가기 →
          </Link>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: "16px", color: "#334155", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
