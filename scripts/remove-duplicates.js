const fs = require('fs');
const path = require('path');

const postsDirPath = path.join(__dirname, '../src/content/posts');

// ============================================================
// 중복 블로그 글 자동 청소 스크립트
// 목적: 같은 맛집/행사에 대해 여러 날짜에 걸쳐 중복 생성된
//       블로그 글을 찾아내어, 가장 긴(알찬) 글 1개만 남기고
//       나머지를 모두 삭제합니다.
// ============================================================

function removeDuplicates() {
  console.log('🧹 중복 블로그 글 청소를 시작합니다...\n');

  if (!fs.existsSync(postsDirPath)) {
    console.error('❌ 블로그 폴더를 찾을 수 없습니다:', postsDirPath);
    return;
  }

  // 1. 모든 .md 파일 읽기
  const files = fs.readdirSync(postsDirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const filePath = path.join(postsDirPath, f);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // [ITEM_ID: xxx] 형태의 주석에서 ID 추출
      const idMatch = content.match(/\[ITEM_ID:\s*([^\]]+)\]/);
      const itemId = idMatch ? idMatch[1].trim() : null;

      // 제목 추출 (front-matter의 title 필드)
      const titleMatch = content.match(/^title:\s*"(.+)"/m);
      const title = titleMatch ? titleMatch[1].trim() : f;

      return {
        name: f,
        path: filePath,
        content,
        size: Buffer.byteLength(content, 'utf8'),
        itemId,
        title,
      };
    });

  console.log(`📂 총 ${files.length}개의 블로그 파일을 분석합니다...\n`);

  let totalDeleted = 0;

  // ============================================================
  // 방법 1: 같은 [ITEM_ID]를 가진 글들에서 중복 제거
  // ============================================================
  const byItemId = {};
  const noItemIdFiles = [];

  for (const file of files) {
    if (file.itemId) {
      if (!byItemId[file.itemId]) byItemId[file.itemId] = [];
      byItemId[file.itemId].push(file);
    } else {
      noItemIdFiles.push(file);
    }
  }

  for (const [itemId, group] of Object.entries(byItemId)) {
    if (group.length <= 1) continue; // 중복 없음

    // 가장 내용이 긴 글(가장 알찬 글)을 남기고 나머지 삭제
    group.sort((a, b) => b.size - a.size);
    const keeper = group[0];
    const toDelete = group.slice(1);

    console.log(`🔍 [ITEM_ID: ${itemId}] 중복 ${group.length}개 발견 → 가장 긴 '${keeper.name}' 유지`);
    for (const file of toDelete) {
      fs.unlinkSync(file.path);
      console.log(`   ❌ 삭제: ${file.name} (${file.size}바이트)`);
      totalDeleted++;
    }
    console.log('');
  }

  // ============================================================
  // 방법 2: ITEM_ID가 없는 글 중 제목이 유사한 글들 중복 제거
  // (예: "오늘의 용인 날씨와 옷차림 팁" 같은 반복 생성 글)
  // ============================================================
  
  // 제목에서 날짜, 이모지, 특수문자를 제거한 '핵심 키워드'만 추출하는 함수
  function extractKeywords(title) {
    return title
      .replace(/[\uD800-\uDFFF][\uD800-\uDFFF]/g, '') // 이모지 제거
      .replace(/[!?🔥💡📍🥢🍜🍣🎪💰🎓👔🎨📝⭐☀️🌤️🌧️🧥👗]/g, '') // 이모지 제거 (보완)
      .replace(/\d{4}[-./]\d{1,2}[-./]\d{1,2}/g, '') // 날짜 형식 제거
      .replace(/[\[\]()「」『』《》<>【】]/g, '') // 괄호 제거
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // 제목 유사도 비교: 두 제목의 핵심 키워드 중 60% 이상 겹치면 중복으로 판단
  function areSimilarTitles(titleA, titleB) {
    const kwA = extractKeywords(titleA);
    const kwB = extractKeywords(titleB);
    
    if (kwA.length < 5 || kwB.length < 5) return false;
    
    // 더 짧은 제목의 핵심 단어들이 긴 제목에 얼마나 포함되어 있는지 확인
    const wordsA = kwA.split(/\s+/).filter(w => w.length >= 2);
    const wordsB = kwB.split(/\s+/).filter(w => w.length >= 2);
    
    const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
    const longer = wordsA.length > wordsB.length ? wordsA : wordsB;
    
    if (shorter.length === 0) return false;
    
    const matchCount = shorter.filter(word => longer.some(w => w.includes(word) || word.includes(w))).length;
    return (matchCount / shorter.length) >= 0.6;
  }

  // ITEM_ID 없는 파일들 중 유사 제목 그룹화
  const processedNames = new Set();
  const similarGroups = [];

  for (let i = 0; i < noItemIdFiles.length; i++) {
    const fileA = noItemIdFiles[i];
    if (processedNames.has(fileA.name)) continue;

    const group = [fileA];
    processedNames.add(fileA.name);

    for (let j = i + 1; j < noItemIdFiles.length; j++) {
      const fileB = noItemIdFiles[j];
      if (processedNames.has(fileB.name)) continue;
      if (areSimilarTitles(fileA.title, fileB.title)) {
        group.push(fileB);
        processedNames.add(fileB.name);
      }
    }

    if (group.length > 1) {
      similarGroups.push(group);
    }
  }

  for (const group of similarGroups) {
    group.sort((a, b) => b.size - a.size);
    const keeper = group[0];
    const toDelete = group.slice(1);

    console.log(`🔍 [유사 제목] 중복 ${group.length}개 발견 → '${keeper.name}' 유지`);
    for (const file of toDelete) {
      fs.unlinkSync(file.path);
      console.log(`   ❌ 삭제: ${file.name}`);
      totalDeleted++;
    }
    console.log('');
  }

  // ============================================================
  // 최종 결과 보고
  // ============================================================
  if (totalDeleted === 0) {
    console.log('✨ 중복된 글이 없습니다. 이미 깨끗한 상태입니다!');
  } else {
    const remaining = files.length - totalDeleted;
    console.log(`\n✅ 청소 완료!`);
    console.log(`   - 삭제된 중복 파일: ${totalDeleted}개`);
    console.log(`   - 남은 고유 파일:   ${remaining}개`);
    console.log(`\n이제 구글 애드센스에 재신청할 준비가 되었습니다! 🎉`);
  }
}

removeDuplicates();
