const fs = require('fs');
const path = require('path');

async function fetchPublicData() {
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

  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const jsonPath = path.join(__dirname, '../public/data/local-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error("환경변수(PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY)가 설정되지 않았습니다.");
    process.exit(1);
  }

  try {
    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    console.log("공공데이터 API 호출 중...");
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=50&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const items = result.data || [];

    if (items.length === 0) {
      console.log("API로부터 가져온 데이터가 없습니다.");
      return;
    }

    // 타 지역(예: 부산) 데이터가 섞이지 않도록 제외 규칙을 포함한 필터링
    const excludeRegions = ['부산', '대구', '인천', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
    
    let filtered = items.filter(item => {
      const targetText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
      
      // '용인'이 포함되어 있는지 확인
      const isYongin = targetText.includes('용인');
      // '경기'가 포함되어 있는지 확인 (단, 타 지역명이 포함된 경우는 제외)
      const isGyeonggi = targetText.includes('경기') && !excludeRegions.some(region => targetText.includes(region) && !targetText.includes('용인'));
      
      return isYongin || isGyeonggi;
    });

    if (filtered.length === 0) {
      console.log("용인 또는 경기 관련 새로운 데이터가 없습니다.");
      return;
    }

    console.log(`필터링된 데이터 수: ${filtered.length}건`);

    // [2단계] 기존 데이터와 비교
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    
    // 기존 아이템의 이름과 ID 목록 생성
    const existingNames = [...db.events, ...db.benefits].map(item => item.name);
    const existingIds = [...db.events, ...db.benefits].map(item => String(item.id));

    // 아직 저장되지 않은 항목 하나만 선택
    const newItemSource = filtered.find(item => 
      !existingNames.includes(item.서비스명) && !existingIds.includes(String(item.서비스ID))
    );

    if (!newItemSource) {
      console.log("이미 모든 데이터가 최신 상태입니다.");
      return;
    }

    console.log("새로운 항목 발견:", newItemSource.서비스명);

    // [3단계] Gemini AI로 새 항목 1개만 가공
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL, emoji: 관련 이모지 1개, tag: 핵심태그 1개(예: 청년, 교육, 복지 등)}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
용인시 또는 경기도 정보인지 다시 한 번 확인하고 가공해줘.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(newItemSource)}`;

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
      throw new Error("Gemini AI로부터 올바른 응답을 받지 못했습니다. API 키나 쿼터 제한을 확인하세요.");
    }

    let aiText = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록 제거 및 JSON 파싱
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let processedItem;
    try {
      processedItem = JSON.parse(aiText);
      // 만약 AI가 ID를 문자열로 주거나 하면 숫자로 변환 (필요시)
      if (processedItem.id === undefined) processedItem.id = Date.now();
    } catch (e) {
      console.error("AI 응답 JSON 파싱 실패:", aiText);
      throw new Error("AI가 생성한 데이터 형식이 올바르지 않습니다.");
    }

    // [4단계] 기존 데이터에 추가
    if (processedItem.category === '행사') {
      db.events.push(processedItem);
    } else {
      db.benefits.push(processedItem);
    }

    db.lastUpdated = today;
    fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');

    console.log("✅ 새로운 데이터 추가 완료:", processedItem.name);

  } catch (error) {
    console.error("❌ 데이터 처리 중 오류 발생:", error.message);
    process.exit(1);
  }
}

fetchPublicData();
