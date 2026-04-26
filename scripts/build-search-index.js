const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const LOCAL_INFO_PATH = path.join(__dirname, '../public/data/local-info.json');
const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const OUTPUT_PATH = path.join(__dirname, '../public/data/search-index.json');

function cleanMarkdown(text) {
  return text
    .replace(/[#*`_~]/g, '') // 마크다운 기호 제거
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크 텍스트만 추출
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim();
}

function buildIndex() {
  const index = [];

  // 1. local-info.json 인덱싱
  if (fs.existsSync(LOCAL_INFO_PATH)) {
    const localData = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
    
    // 행사(events) 추가
    (localData.events || []).forEach(item => {
      index.push({
        type: 'event',
        title: item.name,
        content: cleanMarkdown(`${item.name} ${item.tag} ${item.date}`),
        url: `/` // 메인 페이지 섹션으로 연결됨
      });
    });

    // 혜택(benefits) 추가
    (localData.benefits || []).forEach(item => {
      index.push({
        type: 'benefit',
        title: item.name,
        content: cleanMarkdown(`${item.name} ${item.tag} ${item.date}`),
        url: `/`
      });
    });
  }

  // 2. 블로그 포스트(*.md) 인덱싱
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      const plainContent = cleanMarkdown(content).substring(0, 500);
      const slug = file.replace('.md', '');

      index.push({
        type: 'post',
        title: data.title || slug,
        summary: data.summary || '',
        content: plainContent,
        url: `/blog/${slug}`
      });
    });
  }

  // 결과 저장
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Search index built: ${index.length} entries`);
}

buildIndex();
