const fs = require('fs');
const path = require('path');

async function fetchPublicData() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const jsonPath = path.join(__dirname, '../public/data/local-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error("환경변수(PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY)가 설정되지 않았습니다.");
    return;
  }

  try {
    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${PUBLIC_DATA_API_KEY}`;
    const response = await fetch(url);
    const result = await response.json();
    const items = result.data || [];

    if (items.length === 0) {
      console.log("API로부터 가져온 데이터가 없습니다.");
      return;
    }

    // 필터링 규칙 적용
    let filtered = items.filter(item => 
      (item.서비스명 && item.서비스명.includes('성남')) || 
      (item.서비스목적요약 && item.서비스목적요약.includes('성남')) || 
      (item.지원대상 && item.지원대상.includes('성남')) || 
      (item.소관기관명 && item.소관기관명.includes('성남'))
    );

    if (filtered.length === 0) {
      filtered = items.filter(item => 
        (item.서비스명 && item.서비스명.includes('경기')) || 
        (item.서비스목적요약 && item.서비스목적요약.includes('경기')) || 
        (item.지원대상 && item.지원대상.includes('경기')) || 
        (item.소관기관명 && item.소관기관명.includes('경기'))
      );
    }

    if (filtered.length === 0) {
      filtered = items;
    }

    // [2단계] 기존 데이터와 비교
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    const existingNames = [...db.events, ...db.benefits].map(item => item.name);

    const newItemSource = filtered.find(item => !existingNames.includes(item.서비스명));

    if (!newItemSource) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // [3단계] Gemini AI로 새 항목 1개만 가공
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL, emoji: 관련 이모지 1개, tag: 핵심태그 1개(예: 청년, 교육, 복지 등)}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(newItemSource)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiResult = await geminiResponse.json();
    let aiText = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록 제거 및 JSON 파싱
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const processedItem = JSON.parse(aiText);

    // [4단계] 기존 데이터에 추가
    if (processedItem.category === '행사') {
      db.events.push(processedItem);
    } else {
      db.benefits.push(processedItem);
    }

    db.lastUpdated = today;
    fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');

    console.log("새로운 데이터 추가 완료:", processedItem.name);

  } catch (error) {
    console.error("데이터 처리 중 오류 발생:", error);
    // 에러 발생 시 기존 파일 유지됨 (fs.writeFileSync를 호출하지 않으므로)
  }
}

fetchPublicData();
