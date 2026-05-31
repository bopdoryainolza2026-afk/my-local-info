import postsData from "../../public/data/posts-data.json";

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  content: string;
}

export function getSortedPostsData(): PostData[] {
  const posts = postsData as PostData[];
  return posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

export function getPostData(slug: string): PostData | null {
  const post = (postsData as PostData[]).find(p => p.slug === slug);
  return post || null;
}
