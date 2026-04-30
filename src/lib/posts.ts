import postsData from "../../public/data/posts-data.json";

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

export function getSortedPostsData(): PostData[] {
  return postsData as PostData[];
}

export function getPostData(slug: string): PostData | null {
  const post = (postsData as PostData[]).find(p => p.slug === slug);
  return post || null;
}
