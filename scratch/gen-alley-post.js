const fs = require('fs');
const path = require('path');

async function createSpecificPost() {
  // .env.local 읽기
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) process.env[key.trim()] = valueParts.join('=').trim();
    });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const postsDirPath = path.join(__dirname, '../src/content/posts');
  
  const item = {
    id: "evt-2026-010",
    category: "행사",
    name: "용인 와이페이 '우리 동네 골목상권' 영수증 이벤트",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    location: "용인시 지정 전통시장 및 골목상권",
    target: "용인 와이페이 이용 시민",
    summary: "골목 상점에서 와이페이로 결제하고 영수증을 인증하세요! 추첨을 통해 든든한 와이페이 포인트 선물을 드립니다.",
    link: "https://www.yongin.go.kr/home/www/www08/www08_03/www08_03_01.jsp",
    emoji: "💰",
    tag: "이벤트"
  };

  const today = new Date().toISOString().split('T')[0];
  const prompt = `용인시/경기도 생활 정보 블로그 운영자로서 아래 정보를 바탕으로 [전문적이면서도 따뜻한] 블로그 포스팅을 작성해줘. 
구글 애드센스 승인을 위해 [글자 수 2000자 이상의 매우 풍부한 내용]이 필요해.

정보: ${JSON.stringify(item, null, 2)}

형식 규칙:
---
title: "용인 와이페이로 골목상권 살리고 포인트 혜택까지! 영수증 이벤트 안내"
date: ${today}
summary: 용인시 골목상권 활성화를 위한 와이페이 영수증 인증 이벤트를 소개합니다.
category: 정보
tags: [이벤트, 용인시, 와이페이, 골목상권, 소상공인]
---

본문은 2000자 이상으로 길고 정성스럽게 작성해줘.
마지막에 <!-- [ITEM_ID: ${item.id}] --> 를 꼭 넣어줘.
저장할 파일명 제안: FILENAME: ${today}-yongin-wipay-alley-event`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const result = await response.json();
  let text = result.candidates[0].content.parts[0].text.replace(/```markdown/g, '').replace(/```/g, '').trim();
  
  const filename = `${today}-yongin-wipay-alley-event.md`;
  fs.writeFileSync(path.join(postsDirPath, filename), text.replace(/FILENAME:.*$/im, '').trim(), 'utf8');
  console.log(`✅ 생성 완료: ${filename}`);
}

createSpecificPost();
