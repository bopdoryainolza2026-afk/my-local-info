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
    const combinedItems = [...db.events, ...db.benefits, ...db.restaurants];

    // 한 번에 생성할 모든 미작성 항목 처리 (제한을 크게 늘림)
    const MAX_POSTS_PER_RUN = 100;
    let createdCount = 0;

    console.log(`블로그 작성을 시작합니다. (모든 미작성 항목 대상)`);

    // [추가] 기존 파일 정보를 미리 읽어둡니다 (업그레이드 필요 여부 확인용)
    const existingFiles = fs.readdirSync(postsDirPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const filePath = path.join(postsDirPath, f);
        const content = fs.readFileSync(filePath, 'utf8');
        return { name: f, path: filePath, content: content };
      });

    // 미작성 또는 업그레이드 대상 항목들을 찾아서 반복 처리
    for (let i = combinedItems.length - 1; i >= 0; i--) {
      if (createdCount >= MAX_POSTS_PER_RUN) break;

      const item = combinedItems[i];
      
      // 해당 아이템에 대한 기존 포스트 찾기
      const existingFile = existingFiles.find(f => 
        f.content.includes(item.name) || f.content.includes(`[ITEM_ID: ${item.id}]`)
      );

      // 이미 충분히 긴 글(업그레이드된 글)인지 확인 (기준: 5000바이트)
      if (existingFile && existingFile.content.length > 5000) {
        continue;
      }

      if (existingFile) {
        console.log(`[${createdCount + 1}] 🔄 [${item.name}] 업그레이드 대상 (현재 크기: ${existingFile.content.length}바이트)`);
        // 기존 파일 삭제 (중복 방지)
        try { fs.unlinkSync(existingFile.path); } catch (e) {}
      } else {
        console.log(`[${createdCount + 1}] 🆕 [${item.name}] 새 글 작성 대상`);
      }

      try {
        await createPost(item, GEMINI_API_KEY, postsDirPath);
        createdCount++;
        // API 속도 제한 방지를 위한 짧은 휴식
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(`❌ [${item.name}] 처리 실패:`, err.message);
        continue;
      }
    }

    // [추가] 만약 새로 생성된 글이 너무 적으면, '오늘의 용인 생활 팁' 테마로 글 생성
    if (createdCount < 2) {
      console.log("새로운 소식이 적어 '오늘의 용인 생활 팁'을 추가로 생성합니다...");
      const dailyTips = [
        { id: "tip-weather", name: "오늘의 용인 날씨와 옷차림 팁", tag: "생활", content: "현재 계절과 용인 날씨에 맞는 추천 산책로와 복장 정보" },
        { id: "tip-food", name: "이번 주말 용인 맛집 투어 추천", tag: "맛집", content: "현지인들만 아는 숨은 맛집 리스트와 주차 꿀팁" },
        { id: "tip-culture", name: "용인에서 즐기는 문화 생활", tag: "문화", content: "용인시 박물관, 미술관 전시 소식과 관람 팁" }
      ];

      for (const tip of dailyTips) {
        const isAlreadyWritten = allPostContents.some(content => 
          content.includes(tip.name) && content.includes(new Date().toISOString().split('T')[0])
        );
        if (!isAlreadyWritten) {
          await createPost(tip, GEMINI_API_KEY, postsDirPath, allPostContents, true);
          createdCount++;
          break; // 하루에 하나만 추가
        }
      }
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

async function createPost(item, apiKey, postsDirPath, isDailyTip = false) {
  const today = new Date().toISOString().split('T')[0];
  const prompt = `용인시/경기도 생활 정보 블로그 운영자로서 아래 정보를 바탕으로 [전문적이면서도 따뜻한] 블로그 포스팅을 작성해줘. 
구글 애드센스 승인을 위해 [글자 수 1500자 이상의 풍부한 내용]이 필요해.

현재 날짜: ${today}
정보: ${JSON.stringify(item, null, 2)}
${isDailyTip ? "주제: 이 글은 특정 행사가 아닌, 주민들에게 유용한 '오늘의 생활 꿀팁' 테마로 작성해줘." : ""}

형식 규칙:
1. 상단에 아래 양식의 Front-matter를 포함해줘:
---
title: "(이웃에게 말하듯 친근하고 클릭하고 싶은 제목)"
date: ${today}
summary: (전체 내용을 정중하게 요약한 한 문장)
category: ${isDailyTip ? '오늘의팁' : '정보'}
tags: [${item.tag || '생활'}, 용인시, 경기도, ${isDailyTip ? '꿀팁' : '공고'}]
---

2. 본문 구성 (반드시 1500자 이상으로 길게 작성):
   - [도입부]: 이웃 주민들에게 건네는 따뜻한 인사와 오늘 날씨/분위기에 맞는 서두 (약 200자)
   - [상세 내용]: ${item.name}에 대한 핵심 정보를 아주 상세히 설명 (행사/혜택이면 신청 자격/방법을, 맛집이면 주력 메뉴와 분위기를 데이터 위주로 설명)
   - [주민 활용 꿀팁]: 우리 주민들이 어떻게 활용하면 좋을지 구체적인 시나리오 3가지 (예: 가족 모임, 직장인 회식, 아이와 함께 등)
   - [필수 정보 섹션]: 주소, 연락처, 메뉴/혜택 내용 등을 표(Table) 형식이나 리스트로 명확히 정리
   - [나의 제언]: 운영자로서 이 소식/장소를 추천하는 이유와 개인적인 소감 추가
   - [맺음말]: "오늘도 행복한 용인 생활 되세요!"와 같은 따뜻한 마무리

3. 말투: "~해요", "~입니다"와 같은 친근한 구어체 사용하되, 정보 전달은 정확하게!

4. 마지막 줄에는 반드시 'FILENAME: YYYY-MM-DD-영어키워드' 형식으로 저장할 파일명을 제안해줘.

5. 본문 맨 하단에 보이지 않게 아래 형식의 마크다운 주석으로 데이터 ID를 포함해줘:
<!-- [ITEM_ID: ${item.id}] -->

반드시 위 형식만 출력하고 다른 설명 텍스트는 포함하지 마.`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const geminiResult = await geminiResponse.json();
  if (!geminiResult.candidates || !geminiResult.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error(`AI 응답을 받지 못했습니다. (${item.name})`);
  }

  let fullResponse = geminiResult.candidates[0].content.parts[0].text;
  fullResponse = fullResponse.replace(/```markdown/g, '').replace(/```/g, '').trim();

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
  console.log("✅ 완료:", finalFileName);
}

generateBlogPost();
