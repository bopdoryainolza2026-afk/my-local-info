const fs = require('fs');

const localData = require('./public/data/local-info.json');
const postsData = require('./public/data/posts-data.json');

function getItemBlogLink(itemId) {
  let matched = postsData.find(p => p.content && p.content.includes(`[ITEM_ID: ${itemId}]`));
  if (!matched) {
    matched = postsData.find(p => p.content && p.content.includes(`[ITEM_ID:${itemId}]`));
  }
  return matched ? `/blog/${matched.slug}` : `/blog/auto-post/${itemId}`;
}

function sortByPostDate(items, allPosts) {
  return [...items].sort((a, b) => {
    const linkA = getItemBlogLink(a.id);
    const linkB = getItemBlogLink(b.id);
    const slugA = linkA.replace('/blog/', '');
    const slugB = linkB.replace('/blog/', '');
    const postA = allPosts.find((p) => p.slug === slugA);
    const postB = allPosts.find((p) => p.slug === slugB);
    
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

sorted.slice(0, 5).forEach((r, i) => {
  console.log(`${i+1}. ${r.name} (${r.id}) - Link: ${getItemBlogLink(r.id)}`);
});
