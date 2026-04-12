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

    // [2단계] 최종 업데이트 날짜 갱신 (데이터 유무와 관계없이 '시스템 확인 완료'를 위해 매일 갱신)
    const today = new Date().toISOString().split('T')[0];
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    db.lastUpdated = today;
    fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');

    if (filtered.length === 0) {
      console.log("용인 또는 경기 관련 새로운 데이터가 없습니다. (확인 날짜만 갱신됨)");
      return;
    }

    console.log(`필터링된 데이터 수: ${filtered.length}건`);

    // [3단계] 기존 데이터와 비교 (여러 개 추가 가능하도록 변경)
    const existingNames = [...db.events, ...db.benefits].map(item => item.name);
    const existingIds = [...db.events, ...db.benefits].map(item => String(item.id));

    // 혹시 첫 페이지에 새로운 게 없다면 2페이지도 한 번 더 시도 (더 넓은 수집을 위해)
    if (filtered.filter(item => !existingNames.includes(item.서비스명) && !existingIds.includes(String(item.서비스ID))).length === 0) {
      console.log("1페이지에 새로운 데이터가 없어 2페이지를 추가로 확인합니다...");
      const url2 = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=2&perPage=50&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
      const response2 = await fetch(url2);
      if (response2.ok) {
        const result2 = await response2.json();
        const items2 = result2.data || [];
        const filtered2 = items2.filter(item => {
          const targetText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
          const isYongin = targetText.includes('용인');
          const isGyeonggi = targetText.includes('경기') && !excludeRegions.some(region => targetText.includes(region) && !targetText.includes('용인'));
          return isYongin || isGyeonggi;
        });
        filtered = [...filtered, ...filtered2];
      }
    }

    // 새로운 항목들 추출
    const newItemsFound = filtered.filter(item => 
      !existingNames.includes(item.서비스명) && !existingIds.includes(String(item.서비스ID))
    );

    if (newItemsFound.length === 0) {
      console.log("이미 모든 데이터가 최신 상태입니다.");
      return;
    }

    // 한 번에 최대 몇 개까지 추가할지 설정 (기본 3개)
    const MAX_NEW_ITEMS = 3;
    const processItems = newItemsFound.slice(0, MAX_NEW_ITEMS);

    console.log(`${processItems.length}개의 새로운 항목을 가공합니다.`);

    for (const newItemSource of processItems) {
      console.log("새로운 항목 발견 및 AI 가공 중:", newItemSource.서비스명);

      // [4단계] Gemini AI로 새 항목 가공
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
        console.error(`Gemini AI 응답 실패: ${newItemSource.서비스명}`);
        continue;
      }

      let aiText = geminiResult.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const processedItem = JSON.parse(aiText);
        if (processedItem.id === undefined) processedItem.id = Date.now() + Math.floor(Math.random() * 1000);
        
        if (processedItem.category === '행사') {
          db.events.push(processedItem);
        } else {
          db.benefits.push(processedItem);
        }
        console.log("✅ 데이터 추가 성공:", processedItem.name);
      } catch (e) {
        console.error("AI 응답 JSON 파싱 실패:", aiText);
      }
    }

    db.lastUpdated = today;
    fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');
    console.log("✅ 전체 데이터 파일 업데이트 완료");

  } catch (error) {
    console.error("❌ 데이터 처리 중 오류 발생:", error.message);
    process.exit(1);
  }
}

fetchPublicData();
