const fs = require('fs');

const localData = require('./public/data/local-info.json');
const postsData = require('./public/data/posts-data.json');
const slugMap = require('./public/data/item-slug-map.json');

function getItemBlogLink(itemId) {
  let matched = postsData.find(p => p.content && p.content.includes(`[ITEM_ID: ${itemId}]`));
  if (matched) return `/blog/${matched.slug}`;
  if (slugMap[itemId]) return `/blog/${slugMap[itemId]}`;
  return "/blog";
}

function sortByPostDate(items, allPosts) {
  return [...items].sort((a, b) => {
    const linkA = getItemBlogLink(a.id);
    const linkB = getItemBlogLink(b.id);
    const slugA = linkA.replace('/blog/', '');
    const slugB = linkB.replace('/blog/', '');
    const postA = allPosts.find(p => p.slug === slugA);
    const postB = allPosts.find(p => p.slug === slugB);
    
    const dateA = postA ? new Date(postA.date).getTime() : 0;
    const dateB = postB ? new Date(postB.date).getTime() : 0;
    
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return 0;
  });
}

const restaurants = localData.restaurants;
const sorted = sortByPostDate([...restaurants].reverse(), postsData);

console.log("=== 현재 정렬 순서 ===");
sorted.slice(0, 5).forEach((r, i) => {
  const link = getItemBlogLink(r.id);
  const post = postsData.find(p => p.slug === link.replace('/blog/', ''));
  console.log(`${i+1}. ${r.name} (${post ? post.date : 'No post'})`);
});
