const fs = require('fs');
const path = require('path');

async function generateBlogPost() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const jsonPath = path.join(__dirname, '../public/data/local-info.json');
  const postsDirPath = path.join(__dirname, '../src/content/posts');

  if (!GEMINI_API_KEY) {
    console.error("환경변수(GEMINI_API_KEY)가 설정되지 않았습니다.");
    return;
  }

  try {
    // [1단계] 최신 데이터 확인
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    
    // 이벤드와 혜택 중 마지막 인덱스를 합쳐서 가장 마지막인 항목을 가져옴
    const combinedItems = [...db.events, ...db.benefits];
    const latestItem = combinedItems[combinedItems.length - 1];

    if (!latestItem) {
      console.log("데이터가 없습니다.");
      return;
    }

    // 기존 포스트와 중복 검사 (내용 중에 이름이 포함되어 있는지 확인)
    const existingFileNames = fs.readdirSync(postsDirPath);
    let isAlreadyWritten = false;
    for (const fileName of existingFileNames) {
      if (fileName.endsWith('.md')) {
        const fileContent = fs.readFileSync(path.join(postsDirPath, fileName), 'utf8');
        if (fileContent.includes(latestItem.name)) {
          isAlreadyWritten = true;
          break;
        }
      }
    }

    if (isAlreadyWritten) {
      console.log("이미 작성된 글입니다");
      return;
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiResult = await geminiResponse.json();
    let fullResponse = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 블록 제거 및 정리
    fullResponse = fullResponse.replace(/```markdown/g, '').replace(/```/g, '').trim();

    // [3단계] 파일 저장용 정규표현식 파싱
    const filenameMatch = fullResponse.match(/FILENAME:\s*([^\s\n]+)/i);
    if (!filenameMatch) {
      throw new Error("Gemini 응답에서 파일명(FILENAME) 정보를 찾을 수 없습니다.");
    }

    const finalFileName = filenameMatch[1].trim();
    // FILENAME 부분을 본문에서 제거
    const finalContent = fullResponse.replace(/FILENAME:.*$/im, '').trim();

    const finalFilePath = path.join(postsDirPath, `${finalFileName}.md`);
    fs.writeFileSync(finalFilePath, finalContent, 'utf8');

    console.log("생성 완료:", finalFileName);

  } catch (error) {
    console.error("블로그 글 생성 중 오류 발생:", error);
    // 에러 발생 시 기존 파일 유지됨
  }
}

generateBlogPost();
