import postsData from "../../public/data/posts-data.json";

/**
 * 아이디로 블로그 링크 주소를 반환합니다.
 * 블로그 글 내용 안에 있는 [ITEM_ID: 아이디] 태그를 검색해 
 * 자동으로 최신 매핑 주소를 찾아줍니다. (100% 동적 작동)
 */
export function getItemBlogLink(itemId: string): string {
  if (!postsData || !Array.isArray(postsData)) {
    return `/blog/auto-post/${itemId}`;
  }

  // 1. 공백이 있는 형태 검색: [ITEM_ID: res-001]
  let matched = (postsData as any[]).find(p => {
    if (!p.content) return false;
    return p.content.includes(`[ITEM_ID: ${itemId}]`);
  });

  // 2. 공백이 없는 형태 검색: [ITEM_ID:res-001]
  if (!matched) {
    matched = (postsData as any[]).find(p => {
      if (!p.content) return false;
      return p.content.includes(`[ITEM_ID:${itemId}]`);
    });
  }

  if (matched) {
    return `/blog/${matched.slug}`;
  }

  // 매핑이 없으면 기본 자동 페이지로 이동
  return `/blog/auto-post/${itemId}`;
}

/**
 * 블로그 슬러그로 카드 아이디를 반환합니다.
 */
export function getItemIdBySlug(slug: string): string | null {
  if (!postsData || !Array.isArray(postsData)) {
    return null;
  }

  const cleanSlug = slug.replace(/\/$/, "");
  const post = (postsData as any[]).find(p => p.slug.replace(/\/$/, "") === cleanSlug);
  
  if (post && post.content) {
    const match = post.content.match(/\[ITEM_ID:\s*([a-zA-Z0-9-]+)\]/);
    if (match) {
      return match[1];
    }
  }
  return null;
}
