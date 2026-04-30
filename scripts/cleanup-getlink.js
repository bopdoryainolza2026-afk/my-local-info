const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/PagedSections.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. 맛집 섹션의 link={getLink(res)} 교체
content = content.replace(/link=\{getLink\(res\)\}/g, 'link={getItemBlogLink(res.id)}');

// 2. 교육/일자리/문화 섹션에 남아있는 getLink 함수 블록들 제거
// 교육, 일자리, 문화 섹션 모두 동일한 패턴이므로 정규식으로 제거
const getLinkBlockPattern = /\n\s*const getLink = \(item: any\) => \{\n[\s\S]*?return `\/blog\/auto-post\/\$\{item\.id\}`;\n\s*\};\n/g;
content = content.replace(getLinkBlockPattern, '\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

// 확인
const updated = fs.readFileSync(filePath, 'utf8');
const remaining = (updated.match(/getLink/g) || []);
const newFunc = (updated.match(/getItemBlogLink/g) || []);
console.log('getLink 잔존 횟수:', remaining.length);
console.log('getItemBlogLink 사용 횟수:', newFunc.length);
