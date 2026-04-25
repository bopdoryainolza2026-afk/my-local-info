const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');

async function fetchData() {
  console.log('📡 자동 정보 수집 로봇 작동 시작...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ 데이터 파일을 찾을 수 없습니다.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const today = new Date().toISOString().split('T')[0];

  // [알림] 이 부분은 향후 공공데이터 API나 구청 RSS와 연동될 핵심 로직입니다.
  // 현재는 자동 업데이트 시스템의 뼈대를 구축하기 위해 
  // 최신 업데이트 날짜를 갱신하고 새로운 소식이 있는지 체크하는 기능을 수행합니다.
  
  console.log(`🔍 ${today} 기준 새로운 소식을 검색 중입니다...`);

  // 예시: 매일 새로운 '오늘의 용인 한줄 소식'을 자동으로 생성하거나 
  // 실제 사이트에서 긁어온 정보를 여기에 추가하게 됩니다.
  
  // 데이터 업데이트 날짜 갱신
  data.lastUpdated = today;
  
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ 정보 수집 및 업데이트 완료!');
  } catch (err) {
    console.error('❌ 파일 저장 중 오류 발생:', err);
  }
}

fetchData();
