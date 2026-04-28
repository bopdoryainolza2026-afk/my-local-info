const fs = require('fs');
const path = require('path');

const REQUEST_DELAY = 15000; // 15초 간격 (4 RPM)

async function upgradeAllPosts() {
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
  } catch (err) {}

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY가 없습니다.");
    return;
  }

  const jsonPath = path.join(__dirname, '../public/data/local-info.json');
  const postsDirPath = path.join(__dirname, '../src/content/posts');
  
  const db = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const itemMap = {};
  [...db.events, ...db.benefits, ...db.restaurants, ...db.educationNews].forEach(item => {
    itemMap[item.id] = item;
  });

  const dailyTips = {
    "tip-weather": { id: "tip-weather", name: "오늘의 용인 날씨와 옷차림 팁", tag: "생활", content: "현재 계절과 용인 날씨에 맞는 추천 산책로와 복장 정보" },
    "tip-food": { id: "tip-food", name: "이번 주말 용인 맛집 투어 추천", tag: "맛집", content: "현지인들만 아는 숨은 맛집 리스트와 주차 꿀팁" },
    "tip-culture": { id: "tip-culture", name: "용인에서 즐기는 문화 생활", tag: "문화", content: "용인시 박물관, 미술관 전시 소식과 관람 팁" }
  };

  const files = fs.readdirSync(postsDirPath).filter(f => f.endsWith('.md'));
  console.log(`총 ${files.length}개의 파일을 업그레이드합니다. (데이터 매칭 실패 시 기존 내용 활용)`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(postsDirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let itemId;
    const idMatch = content.match(/\[ITEM_ID:\s*([^\]]+)\]/);
    if (idMatch) itemId = idMatch[1].trim();

    let item = itemId ? (itemMap[itemId] || dailyTips[itemId]) : null;

    // 만약 ID로 못 찾으면 제목 매칭 시도
    if (!item) {
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        item = Object.values(itemMap).find(it => 
          (it.name && title.includes(it.name)) || (it.title && title.includes(it.title))
        );
      }
    }

    // 여전히 못 찾으면 '기존 내용 기반 업그레이드' 모드로 전환
    const useExistingContent = !item;
    const targetItem = item || { name: file, existingContent: content };

    console.log(`[${i+1}/${files.length}] 업그레이드 중: ${item ? (item.name || item.title) : file}`);
    
    try {
      await createPost(targetItem, GEMINI_API_KEY, filePath, !!(itemId && itemId.startsWith('tip-')), useExistingContent);
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
      }
    } catch (err) {
      console.error(`❌ 실패: ${file} - ${err.message}`);
    }
  }
  console.log("\n모든 블로그 글 업그레이드가 완료되었습니다!");
}

async function createPost(item, apiKey, filePath, isDailyTip, useExistingContent) {
  const today = new Date().toISOString().split('T')[0];
  let prompt;

  if (useExistingContent) {
    prompt = `용인시/경기도 생활 정보 블로그 운영자로서 아래 [기존 포스팅 내용]을 바탕으로 내용을 대폭 보강하고 업그레이드해줘.
구글 애드센스 승인을 위해 [글자 수 1500자 이상의 풍부한 내용]이 필요해. 기존의 핵심 정보를 유지하면서 훨씬 더 상세하고 친절하게 설명해줘.

[기존 내용]:
${item.existingContent}

형식 규칙:
1. 기존 Front-matter 양식을 유지하되, 날짜는 ${today}로 갱신해줘.
2. 본문 구성 (반드시 1500자 이상): 도입부, 상세 내용, 주민 활용 꿀팁 3가지, 필수 정보 섹션(표/리스트), 나의 제언, 맺음말
3. 말투: "~해요", "~입니다"
4. 본문 하단에 기존 ITEM_ID 주석이 있다면 유지하고, 없다면 파일명을 바탕으로 새로 만들어줘.
반드시 마크다운 형식만 출력해.`;
  } else {
    prompt = `용인시/경기도 생활 정보 블로그 운영자로서 아래 정보를 바탕으로 [전문적이면서도 따뜻한] 블로그 포스팅을 작성해줘. 
구글 애드센스 승인을 위해 [글자 수 1500자 이상의 풍부한 내용]이 필요해.

정보: ${JSON.stringify(item, null, 2)}
${isDailyTip ? "주제: 이 글은 특정 행사가 아닌, 주민들에게 유용한 '오늘의 생활 꿀팁' 테마로 작성해줘." : ""}

형식 규칙:
1. 상단에 Front-matter 포함 (날짜: ${today})
2. 본문 구성 (1500자 이상): 도입부, 상세 내용, 주민 활용 꿀팁(3가지), 필수 정보 섹션(표/리스트), 나의 제언, 맺음말
3. 본문 하단에 보이지 않게 주석 포함: <!-- [ITEM_ID: ${item.id}] -->`;
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        let fullResponse = result.candidates[0].content.parts[0].text;
        fullResponse = fullResponse.replace(/```markdown/g, '').replace(/```/g, '').trim();
        fs.writeFileSync(filePath, fullResponse.replace(/FILENAME:.*$/im, '').trim(), 'utf8');
        return; // 성공 시 종료
      } else {
        throw new Error(result.error ? result.error.message : "응답 데이터 부족");
      }
    } catch (err) {
      attempts++;
      console.warn(`[재시도 ${attempts}/${maxAttempts}] 오류: ${err.message}`);
      if (attempts >= maxAttempts) throw err;
      await new Promise(r => setTimeout(r, 2000)); // 2초 대기 후 재시도
    }
  }
}

upgradeAllPosts();
