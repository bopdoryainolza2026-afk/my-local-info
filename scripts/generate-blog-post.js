const fs = require('fs');
const path = require('path');

async function generateBlogPost() {
  // [로컬 실행 환경 지원] .env.local 파일에서 환경변수 읽기
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      });
    }
  } catch (err) {
    console.warn(".env.local 읽기 실패 (무시됨):", err.message);
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const jsonPath = path.join(__dirname, '../public/data/local-info.json');
  const postsDirPath = path.join(__dirname, '../src/content/posts');

  if (!GEMINI_API_KEY) {
    console.error("환경변수(GEMINI_API_KEY)가 설정되지 않았습니다.");
    process.exit(1);
  }

  try {
    // [1단계] 데이터 로드
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    const combinedItems = [...db.events, ...db.benefits];

    // 한 번에 생성할 최대 블로그 수 (기본 3개)
    const MAX_POSTS_PER_RUN = 3;
    let createdCount = 0;

    console.log(`블로그 작성을 시작합니다. (최대 ${MAX_POSTS_PER_RUN}개)`);

    // 기존 포스트 목록 가져오기 (반복문 밖에서 한 번만 로드하고 루프 안에서 업데이트)
    let postFiles = fs.readdirSync(postsDirPath).filter(f => f.endsWith('.md'));
    let allPostContents = postFiles.map(f => fs.readFileSync(path.join(postsDirPath, f), 'utf8'));

    // 미작성 항목들을 찾아서 반복 처리
    for (let i = combinedItems.length - 1; i >= 0; i--) {
      if (createdCount >= MAX_POSTS_PER_RUN) break;

      const item = combinedItems[i];
      // 이름뿐만 아니라 파일 내용 속의 ID 주석도 확인하여 중복 방지
      const isAlreadyWritten = allPostContents.some(content => 
        content.includes(item.name) || content.includes(`[ITEM_ID: ${item.id}]`)
      );
      
      if (isAlreadyWritten) continue;

      console.log(`[${createdCount + 1}/${MAX_POSTS_PER_RUN}] 블로그 생성 대상 항목:`, item.name);

      // [2단계] Gemini AI로 블로그 글 생성
      const today = new Date().toISOString().split('T')[0];
      const prompt = `용인시/경기도 생활 정보 블로그 운영자로서 아래 정보를 바탕으로 친근하고 유익한 블로그 포스팅을 작성해줘.

정보: ${JSON.stringify(item, null, 2)}

형식 규칙:
1. 상단에 아래 양식의 Front-matter를 포함해줘:
---
title: "(이웃에게 말하듯 친근하고 클릭하고 싶은 제목)"
date: ${today}
summary: (전체 내용을 정중하게 요약한 한 문장)
category: 정보
tags: [${item.tag || '생활'}, 용인시, 경기도]
---

2. 본문 구성:
   - 도입부: 이웃 주민들에게 건네는 따뜻한 인사와 정보 소개
   - 상세 내용: ${item.name}의 주요 혜택/행사 내용 요약
   - 추천 이유: 이 정보가 왜 유용한지 3가지 포인트로 정리
   - 신청/참여 방법: 어떻게 이용하면 되는지 구체적으로 안내
   - 맺음말: 도움이 되길 바란다는 따뜻한 마무리

3. 말투: "~해요", "~입니다"와 같은 친근한 구어체 사용

4. 마지막 줄에는 반드시 'FILENAME: YYYY-MM-DD-영어키워드' 형식으로 저장할 파일명을 제안해줘.

5. 본문 맨 하단에 보이지 않게 아래 형식의 마크다운 주석으로 데이터 ID를 포함해줘 (중복 방지용):
<!-- [ITEM_ID: ${item.id}] -->

반드시 위 형식만 출력하고 다른 설명 텍스트는 포함하지 마.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const geminiResult = await geminiResponse.json();
      if (!geminiResult.candidates || !geminiResult.candidates[0]?.content?.parts?.[0]?.text) {
        console.error(`AI 응답을 받지 못했습니다. (${item.name})`);
        continue;
      }

      let fullResponse = geminiResult.candidates[0].content.parts[0].text;
      fullResponse = fullResponse.replace(/```markdown/g, '').replace(/```/g, '').trim();

      // [3단계] 파일 저장
      const filenameMatch = fullResponse.match(/FILENAME:\s*([^\s\n]+)/i);
      let finalFileName;
      if (filenameMatch) {
        finalFileName = filenameMatch[1].trim();
      } else {
        const safeName = item.name.replace(/[^a-zA-Z0-9가-힣]/g, '').substring(0, 10);
        finalFileName = `${today}-${safeName}`;
      }

      const finalContent = fullResponse.replace(/FILENAME:.*$/im, '').trim();
      const finalFilePath = path.join(postsDirPath, `${finalFileName}.md`);
      
      fs.writeFileSync(finalFilePath, finalContent, 'utf8');
      console.log("✅ 블로그 포스팅 생성 완료:", finalFileName);

      // 다음 반복을 위해 상태 업데이트
      allPostContents.push(finalContent);
      createdCount++;
    }

    if (createdCount === 0) {
      console.log("새로 작성할 블로그 대상 데이터가 없습니다.");
    } else {
      console.log(`총 ${createdCount}개의 블로그 포스팅이 새로 생성되었습니다.`);
    }

  } catch (error) {
    console.error("❌ 블로그 글 생성 중 오류 발생:", error.message);
    process.exit(1);
  }
}

generateBlogPost();
