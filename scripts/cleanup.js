const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');

function cleanup() {
  console.log('🧹 자동 청소 로봇 작동 시작...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ 데이터 파일을 찾을 수 없습니다.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const today = new Date().toISOString().split('T')[0];
  
  let deletedCount = 0;

  // 1. 행사(events) 청소
  if (data.events) {
    const originalCount = data.events.length;
    data.events = data.events.filter(item => {
      const endDate = item.endDate || "9999-12-31";
      if (endDate === "상시") return true;
      return endDate >= today;
    });
    deletedCount += (originalCount - data.events.length);
  }

  // 2. 혜택(benefits) 청소
  if (data.benefits) {
    const originalCount = data.benefits.length;
    data.benefits = data.benefits.filter(item => {
      const endDate = item.endDate || item.deadline || "9999-12-31";
      if (endDate === "상시") return true;
      return endDate >= today;
    });
    deletedCount += (originalCount - data.benefits.length);
  }

  // 결과 저장
  if (deletedCount > 0) {
    data.lastUpdated = today;
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ 청소 완료! 총 ${deletedCount}개의 만료된 정보를 삭제했습니다.`);
  } else {
    console.log('✨ 삭제할 만료된 정보가 없습니다. 아주 깨끗하네요!');
  }
}

cleanup();
