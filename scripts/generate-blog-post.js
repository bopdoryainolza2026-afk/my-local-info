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
    // 한 번에 생성할 최대 개수 (무료 API 한도 고려하여 5개로 조절)
    const MAX_POSTS_PER_RUN = 5;
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

      try {
        await createPost(item, GEMINI_API_KEY, postsDirPath);
        
        // 새로운 글 생성이 성공한 경우에만 기존 (짧은) 파일 삭제
        if (existingFile) {
          try { fs.unlinkSync(existingFile.path); } catch (e) {}
        }
        
        createdCount++;
        // API 속도 제한 방지를 위한 6초 대기
        await new Promise(resolve => setTimeout(resolve, 6000));
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
        // [수정] 날짜 무관하게, 이 팁 ID로 이미 작성된 파일이 있으면 건너뜀
        const isAlreadyWritten = existingFiles.some(f => 
          f.content.includes(tip.id) || f.content.includes(tip.name)
        );
        if (!isAlreadyWritten) {
          await createPost(tip, GEMINI_API_KEY, postsDirPath, true);
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
  const prompt = `당신은 네이버 인플루언서이자 방문자 수가 매우 많은 '파워 블로거'입니다. 
아래 정보를 바탕으로 기계적인 느낌이 전혀 없는, 사람이 직접 다녀오거나 꼼꼼히 알아보고 쓴 것 같은 아주 자연스럽고 흡입력 있는 블로그 포스팅을 작성해 주세요.
구글 애드센스 승인을 위해 [글자 수 1500자 이상의 풍부하고 깊이 있는 내용]이 필요합니다.

현재 날짜: ${today}
정보: ${JSON.stringify(item, null, 2)}
${isDailyTip ? "주제: 이 글은 특정 행사가 아닌, 주민들에게 유용한 '오늘의 생활 꿀팁' 테마로 작성해 주세요." : ""}

형식 및 작성 규칙:
1. 상단에 아래 양식의 Front-matter를 반드시 포함해 주세요:
---
title: "(호기심을 유발하고 클릭하고 싶은 센스있는 제목)"
date: ${today}
summary: (전체 내용을 친근하게 요약한 한 문장)
category: ${isDailyTip ? '오늘의팁' : '정보'}
tags: [${item.tag || '생활'}, 용인시, 경기도, ${isDailyTip ? '꿀팁' : '추천'}]
---

2. 본문 구성 및 스타일 (매우 중요):
   - [도입부]: "안녕하세요, 용인 생활정보 운영자입니다" 같은 뻔한 인사말은 절대 금지! 날씨나 최근 용인의 분위기, 혹은 일상적인 공감대로 자연스럽게 글을 시작하세요.
   - [시각적 입체감]: 글이 지루하지 않게 **중요한 키워드나 문장은 반드시 굵은 글씨(**텍스트**)**로 강조해 주세요. 
   - [소제목 활용]: 내용이 바뀔 때마다 \`###\` (H3) 태그와 이모지를 활용해 소제목을 달아서 가독성을 높여주세요.
   - [인용구 활용]: 핵심 정보나 꿀팁, 명언 등은 마크다운 인용구(\`>\`)를 사용하여 눈에 띄게 만들어 주세요.
   - [상세 내용 & 꿀팁]: ${item.name}에 대한 단순 정보 나열이 아니라, "제가 직접 알아보니 이런 점이 정말 좋더라고요", "특히 아이들과 함께 가실 분들은 이 부분을 주의하세요!" 처럼 경험자(또는 전문가)의 생생한 팁을 3가지 이상 적어주세요.
   - [깔끔한 정리]: 주소, 연락처, 신청 방법 등은 가독성 좋게 리스트(- )나 표(Table)로 깔끔하게 정리해 주세요.

3. 말투와 톤:
   - 딱딱한 로봇 말투나 설명서 같은 문체는 피해주세요. 
   - 친한 이웃에게 꿀정보를 수다 떨듯 알려주는 친근하고 생동감 있는 구어체("~했답니다", "~라는 사실 알고 계셨나요?", "~하시길 추천드려요!")를 사용하세요.

4. 마지막 줄에는 반드시 'FILENAME: YYYY-MM-DD-영어키워드' 형식으로 저장할 파일명을 제안해 주세요.
5. 본문 맨 하단에 보이지 않게 아래 형식의 마크다운 주석으로 데이터 ID를 포함해줘:
<!-- [ITEM_ID: ${item.id}] -->

반드시 위 형식만 출력하고 다른 설명 텍스트는 포함하지 마.`;

  // [수정] 안정적이고 무료 한도가 확실한 gemini-flash-latest 모델로 변경
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
  let geminiResponse;
  let success = false;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (geminiResponse.status === 429) {
      const waitTime = attempt * 15; // 15초, 30초, 45초 대기
      console.warn(`⏳ AI가 글을 쓰느라 너무 바빠요! ${waitTime}초 후 다시 시도합니다... (${attempt}/3)`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      continue;
    }
    
    if (geminiResponse.ok) {
      success = true;
      break;
    } else {
      break;
    }
  }

  const geminiResult = await geminiResponse.json();
  if (!success || !geminiResult.candidates || !geminiResult.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error(`AI 응답 오류 (${item.name}): ` + (geminiResult.error ? geminiResult.error.message : "알 수 없는 오류"));
  }

  let fullResponse = geminiResult.candidates[0].content.parts[0].text;
  fullResponse = fullResponse.replace(/```markdown/g, '').replace(/```/g, '').trim();

  const filenameMatch = fullResponse.match(/FILENAME:\s*([^\s\n]+)/i);
  let finalFileName;
  if (filenameMatch) {
    finalFileName = filenameMatch[1].trim().replace(/[*"'/\\<>|?:]/g, '');
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
