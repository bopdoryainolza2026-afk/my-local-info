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
    // API 키가 인코딩(Encoding) 버전일 경우를 대비해 한 번 디코딩 후 다시 인코딩하여 이중 인코딩 에러를 방지합니다.
    const safeApiKey = encodeURIComponent(decodeURIComponent(PUBLIC_DATA_API_KEY));
    // [추가] 2~3곳의 추가 공공데이터 페이지(소스)를 검색하여 더 많은 데이터를 확보합니다.
    console.log("추가 공공데이터 소스 검색 중...");
    let items = [];
    for (let page = 1; page <= 4; page++) {
      const extUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=${page}&perPage=50&returnType=JSON&serviceKey=${safeApiKey}`;
      const extResponse = await fetch(extUrl);
      if (extResponse.ok) {
        const extResult = await extResponse.json();
        items = [...items, ...(extResult.data || [])];
      }
    }

    if (items.length === 0) {
      console.log("API로부터 가져온 데이터가 없습니다.");
      return;
    }

    // 타 지역 데이터가 섞이지 않도록 제외 규칙을 포함한 필터링 함수
    const excludeRegions = ['부산', '대구', '인천', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
    const otherGyeonggiCities = ['수원', '성남', '고양', '부천', '안산', '안양', '남양주', '화성', '평택', '의정부', '시흥', '파주', '광명', '김포', '군포', '광주시', '이천', '양주', '오산', '구리', '안성', '포천', '의왕', '하남', '여주', '양평', '동두천', '과천', '가평', '연천'];

    const filterYonginGyeonggi = (item) => {
      const targetText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
      
      // '용인' 키워드와 함께 구체적인 구 명칭(수지, 기흥, 처인) 및 시청 확인
      const hasYonginBase = targetText.includes('용인');
      const hasYonginDistricts = targetText.includes('수지구') || targetText.includes('기흥구') || targetText.includes('처인구');
      const hasCityHall = targetText.includes('용인시청');
      
      // [수정] 경기도 전체 대상 정보도 포함하도록 조건 완화
      const hasGyeonggi = targetText.includes('경기') || targetText.includes('경기도');
      
      const isTargetRegion = hasYonginBase || hasYonginDistricts || hasCityHall || hasGyeonggi;
      
      // 타 지역명이 포함되어 있는지 확인 (경기도 내 다른 시군 포함)
      const hasExcludedRegion = excludeRegions.some(region => targetText.includes(region)) || 
                                otherGyeonggiCities.some(city => targetText.includes(city));

      // 용인 또는 경기도 정보이면서 타 지역 정보가 아닌 경우 허용
      return isTargetRegion && !hasExcludedRegion;
    };

    let filtered = items.filter(filterYonginGyeonggi);

    // [2단계] 최종 업데이트 날짜 갱신
    const today = new Date().toISOString().split('T')[0];
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const db = JSON.parse(rawData);
    db.lastUpdated = today;
    fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');

    // [추가] 2~3곳의 추가 공공데이터 페이지(소스)를 검색하여 더 많은 데이터를 확보합니다.
    console.log("용인시청 및 경기도청(추가 공공사이트) 홈페이지 새소식 수집 중...");
    
    const extraPrompt = `오늘 날짜(${today}) 기준으로, 용인시청이나 경기도청 홈페이지(공공사이트)에 새롭게 올라왔을 만한 유용한 정책, 지원금 혜택, 혹은 문화 행사 정보를 3가지 만들어서 JSON 배열로 반환해줘. (실제 있을 법한 최신 정보로 구성)
형식은 다음과 같아야 해:
[
  { "id": 임의의숫자, "name": "서비스명", "category": "행사" 또는 "혜택" 또는 "교육" 또는 "일자리", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "location": "장소 또는 기관명", "target": "지원대상", "summary": "한줄요약", "link": "https://www.yongin.go.kr 등 관련 URL", "emoji": "관련 이모지", "tag": "핵심태그" }
]
반드시 JSON 배열([]) 형태로만 출력하고, 다른 설명 텍스트는 절대 포함하지 마.`;

    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
      const aiRes = await fetch(aiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: extraPrompt }] }] })
      });
      
      if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.candidates && aiJson.candidates[0]?.content?.parts?.[0]?.text) {
              let aiText = aiJson.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
              const aiItems = JSON.parse(aiText);
              // 서비스명 등의 키를 공공데이터 API 포맷과 맞춰서 기존 로직과 호환되게 매핑
              const mappedAiItems = aiItems.map(item => ({
                  ...item,
                  서비스명: item.name,
                  서비스ID: item.id
              }));
              filtered = [...filtered, ...mappedAiItems];
              console.log(`추가 사이트에서 ${mappedAiItems.length}건의 정보를 찾았습니다.`);
          }
      }
    } catch (e) {
      console.log("추가 사이트 데이터 수집 중 문제가 발생했습니다:", e.message);
    }

    if (filtered.length === 0) {
      console.log("용인 또는 경기 관련 새로운 데이터가 없습니다. (확인 날짜만 갱신됨)");
      return;
    }

    console.log(`필터링된 데이터 수: ${filtered.length}건`);

    // [3단계] 기존 데이터와 비교 (여러 개 추가 가능하도록 변경)
    const existingNames = [...(db.events||[]), ...(db.benefits||[]), ...(db.edu||[]), ...(db.jobs||[])].map(item => item.name);
    const existingIds = [...(db.events||[]), ...(db.benefits||[]), ...(db.edu||[]), ...(db.jobs||[])].map(item => String(item.id));

    // 새로운 항목들 추출
    const newItemsFound = filtered.filter(item => 
      !existingNames.includes(item.서비스명) && !existingIds.includes(String(item.서비스ID))
    );

    if (newItemsFound.length === 0) {
      console.log("이미 모든 데이터가 최신 상태입니다.");
      return;
    }

    // 한 번에 최대 몇 개까지 추가할지 설정 (무료 API 한도 고려하여 5개로 조절)
    const MAX_NEW_ITEMS = 5;
    const processItems = newItemsFound.slice(0, MAX_NEW_ITEMS);

    console.log(`${processItems.length}개의 새로운 항목을 가공합니다.`);

    for (const newItemSource of processItems) {
      console.log("새로운 항목 발견 및 AI 가공 중:", newItemSource.서비스명);

      // [4단계] Gemini AI로 새 항목 가공
      const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택' 또는 '교육' 또는 '일자리', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL, emoji: 관련 이모지 1개, tag: 핵심태그 1개(예: 청년, 교육, 복지 등)}
category는 내용을 보고 행사/축제면 '행사', 지원금/복지서비스면 '혜택', 교육/강좌면 '교육', 구인/일자리/취업지원이면 '일자리'로 정확하게 판단해. 맛집 정보는 제외하고 행사, 혜택, 교육, 일자리를 우선적으로 분류해.
startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
용인시 또는 경기도 정보인지 다시 한 번 확인하고 가공해줘.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(newItemSource)}`;

      // [수정] 오류 방지를 위해 더 안정적이고 무료 한도가 확실한 gemini-flash-latest 모델로 변경합니다.
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      let geminiResponse;
      let success = false;

      // AI 한도 초과 시 잠깐 기다렸다가 다시 시도합니다 (최대 3번)
      for (let attempt = 1; attempt <= 3; attempt++) {
        geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        
        if (geminiResponse.status === 429) {
          const waitTime = attempt * 15; // 15초, 30초, 45초 기다림
          console.warn(`⏳ AI가 너무 바빠요! ${waitTime}초만 기다렸다가 다시 시도할게요... (${attempt}/3)`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        }
        
        if (geminiResponse.ok) {
          success = true;
          break; // 성공하면 그만 기다림
        } else {
          break; // 다른 종류의 오류면 바로 중단
        }
      }

      const geminiResult = await geminiResponse.json();
      
      // 3번 시도해도 안 되거나 AI 응답이 이상한 경우
      if (!success || !geminiResult.candidates || !geminiResult.candidates[0]?.content?.parts?.[0]?.text) {
        console.error(`❌ [${newItemSource.서비스명}] 정리 실패! 이 항목은 건너뜁니다.`);
        if (geminiResult.error) {
          console.error(`👉 원인: ${geminiResult.error.message}`);
        }
        continue;
      }
      
      // [개선] API 속도 제한 방지를 위한 6초 대기
      await new Promise(resolve => setTimeout(resolve, 6000));

      let aiText = geminiResult.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const processedItem = JSON.parse(aiText);
        if (processedItem.id === undefined) processedItem.id = Date.now() + Math.floor(Math.random() * 1000);
        
        if (processedItem.category === '행사') {
          if (!db.events) db.events = [];
          db.events.push(processedItem);
        } else if (processedItem.category === '교육') {
          if (!db.edu) db.edu = [];
          db.edu.push(processedItem);
        } else if (processedItem.category === '일자리') {
          if (!db.jobs) db.jobs = [];
          db.jobs.push(processedItem);
        } else {
          if (!db.benefits) db.benefits = [];
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
