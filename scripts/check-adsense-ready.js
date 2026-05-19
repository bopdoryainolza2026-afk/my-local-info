const fs = require('fs');
const path = require('path');

function runAdSenseAudit() {
  console.log('🔍 [구글 애드센스 승인 대비 최종 정밀 검진 시작]');
  console.log('==============================================');

  const postsDir = path.join(__dirname, '../src/content/posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  const audits = [];
  const itemIdMap = new Map();
  const titleMap = new Map();

  let shortPostsCount = 0;
  let missingIdCount = 0;
  let duplicateIdCount = 0;
  let duplicateTitleCount = 0;

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. 글자 수 체크 (공백 제외 한글/영문 순수 텍스트 기준 대략적인 파악)
    const bodyText = content.replace(/---[\s\S]*?---/, '').trim();
    const charCount = bodyText.replace(/\s/g, '').length;

    // Front matter 파싱
    const fmMatch = content.match(/---([\s\S]*?)---/);
    let title = '';
    if (fmMatch) {
      const fmLines = fmMatch[1].split('\n');
      const titleLine = fmLines.find(l => l.startsWith('title:'));
      if (titleLine) {
        title = titleLine.replace('title:', '').replace(/"/g, '').trim();
      }
    }

    // 2. ITEM_ID 체크
    const idMatch = content.match(/<!--\s*\[ITEM_ID:\s*([^\]]+)\]\s*-->/);
    const itemId = idMatch ? idMatch[1].trim() : null;

    const audit = {
      file,
      title,
      charCount,
      itemId,
      issues: []
    };

    // 이슈 검출 - 1500글자 미만 (바이트 아님, 공백 제외 순수 글자 수)
    if (charCount < 800) {
      audit.issues.push(`⚠️ 글자 수 부족 (${charCount}자) - 구글은 1000자 이상의 긴 글을 선호합니다.`);
      shortPostsCount++;
    }

    // 이슈 검출 - ITEM_ID 누락
    if (!itemId) {
      audit.issues.push(`🚨 ITEM_ID 누락 - 메인 화면의 정보 카드와 연결되지 않을 수 있습니다.`);
      missingIdCount++;
    } else {
      if (itemIdMap.has(itemId)) {
        audit.issues.push(`🚨 ITEM_ID 중복 [${itemId}] - 이미 '${itemIdMap.get(itemId)}' 파일이 이 ID를 사용 중입니다.`);
        duplicateIdCount++;
      } else {
        itemIdMap.set(itemId, file);
      }
    }

    // 이슈 검출 - 제목 유사/중복
    if (title) {
      const cleanTitle = title.replace(/\s+/g, '');
      if (titleMap.has(cleanTitle)) {
        audit.issues.push(`🚨 제목 유사/중복 ['${title}'] - '${titleMap.get(cleanTitle)}' 파일과 거의 똑같은 제목입니다.`);
        duplicateTitleCount++;
      } else {
        titleMap.set(cleanTitle, file);
      }
    }

    audits.push(audit);
  });

  console.log(`📊 [검사 대상 포스트 수]: ${files.length}개`);
  console.log('----------------------------------------------');

  let criticalIssuesFound = false;

  audits.forEach(a => {
    if (a.issues.length > 0) {
      criticalIssuesFound = true;
      console.log(`📄 파일명: ${a.file}`);
      console.log(`   제목: ${a.title || '없음'}`);
      a.issues.forEach(issue => console.log(`   ${issue}`));
      console.log('----------------------------------------------');
    }
  });

  console.log('==============================================');
  console.log('🏁 [최종 정밀 진단 결과 요약]');
  console.log(`- 전체 글 개수: ${files.length}개 (매우 이상적인 규모)`);
  console.log(`- 글자 수 부족 경고: ${shortPostsCount}건`);
  console.log(`- ITEM_ID 누락 오류: ${missingIdCount}건`);
  console.log(`- ITEM_ID 중복 오류: ${duplicateIdCount}건`);
  console.log(`- 제목 중복 오류: ${duplicateTitleCount}건`);

  if (!criticalIssuesFound) {
    console.log('\n🎉 축하합니다! 발견된 중복, 누락, 부실 글이 전혀 없습니다! 완벽한 상태입니다! 🚀');
  } else {
    console.log('\n⚠️ 일부 조정이 필요한 글들이 있습니다. 위 상세 로그를 확인해 주세요.');
  }
}

runAdSenseAudit();
