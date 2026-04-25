const fs = require('fs');
const path = require('path');

// 데이터 경로
const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');
const BLOG_PATH = path.join(__dirname, '../public/data/blog-posts.json');

function generateBlog() {
  console.log('✍️ 인공지능 기자가 기사를 작성 중입니다...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ 소스 데이터를 찾을 수 없습니다.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const today = new Date().toISOString().split('T')[0];

  // 중요도 순으로 데이터 정렬 (1. 마감임박 지원금, 2. 예정된 축제, 3. 맛집)
  const allItems = [
    ...(data.benefits || []).map(b => ({ ...b, type: 'benefit', priority: 1 })),
    ...(data.events || []).map(e => ({ ...e, type: 'event', priority: 2 })),
    ...(data.restaurants || []).map(r => ({ ...r, type: 'restaurant', priority: 3 }))
  ];

  // 오늘 날짜 기준으로 유효한 것들만 필터링하고 우선순위 높은 순으로 3개 선정
  const selectedPosts = allItems
    .filter(item => {
      const endDate = item.endDate || item.deadline || "9999-12-31";
      return endDate >= today || endDate === "상시";
    })
    .sort((a, b) => a.priority - b.priority) // 숫자가 낮을수록(1) 우선순위 높음
    .slice(0, 3);

  // 블로그 형식으로 변환
  const blogPosts = selectedPosts.map((item, index) => {
    let titlePrefix = "";
    if (item.type === 'benefit') titlePrefix = "[필독/지원금] ";
    if (item.type === 'event') titlePrefix = "[축제/행사] ";
    if (item.type === 'restaurant') titlePrefix = "[맛집/탐방] ";

    return {
      id: `blog-${today}-${index + 1}`,
      title: `${titlePrefix}${item.name}`,
      excerpt: item.summary,
      content: `${item.summary}\n\n📍 장소: ${item.location || '상세내용 참조'}\n📅 기간: ${item.startDate || ''} ~ ${item.endDate || item.deadline || '상시'}\n🔗 상세정보: ${item.link || '용인시 홈페이지 참조'}`,
      date: today,
      author: "용인 인공지능 기자",
      category: item.tag || item.category,
      imageUrl: item.imageUrl || "/images/default-blog.png",
      link: `/blog/${item.id}`
    };
  });

  // 기존 블로그 데이터 읽기 또는 생성
  let existingBlog = [];
  if (fs.existsSync(BLOG_PATH)) {
    existingBlog = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'));
  }

  // 중복 체크 후 최신 글을 맨 앞으로 추가 (최대 30개 유지)
  const newBlog = [...blogPosts, ...existingBlog.filter(p => !blogPosts.some(np => np.title === p.title))].slice(0, 30);

  fs.writeFileSync(BLOG_PATH, JSON.stringify(newBlog, null, 2), 'utf8');
  console.log(`✅ 오늘의 기사 3건 작성 완료! (${today})`);
}

generateBlog();
