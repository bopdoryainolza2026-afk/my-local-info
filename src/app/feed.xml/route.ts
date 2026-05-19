import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://yongin-love-info.com';
  const posts = getSortedPostsData();

  const xmlItems = posts
    .slice(0, 50) // 최근 50개의 글만 실시간 RSS로 발송합니다.
    .map((post) => {
      const cleanTitle = post.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
        
      const cleanSummary = (post.summary || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      return `
    <item>
      <title>${cleanTitle}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${cleanSummary}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>`;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>용인시 생활 정보 - 실시간 뉴스피드</title>
    <link>${baseUrl}</link>
    <description>용인시의 실시간 교육, 혜택, 맛집, 축제 정보를 가장 빠르게 만나보세요.</description>
    <language>ko-kr</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${xmlItems}
  </channel>
</rss>`;

  return new Response(rssFeedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
